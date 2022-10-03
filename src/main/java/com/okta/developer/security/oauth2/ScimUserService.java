package com.okta.developer.security.oauth2;

import com.okta.developer.config.Constants;
import com.okta.developer.domain.Authority;
import com.okta.developer.domain.User;
import com.okta.developer.repository.AuthorityRepository;
import com.okta.developer.repository.UserRepository;
import jakarta.ws.rs.core.Response;
import java.util.Collection;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import org.apache.directory.scim.core.repository.Repository;
import org.apache.directory.scim.core.repository.UpdateRequest;
import org.apache.directory.scim.core.schema.SchemaRegistry;
import org.apache.directory.scim.server.exception.UnableToCreateResourceException;
import org.apache.directory.scim.server.exception.UnableToUpdateResourceException;
import org.apache.directory.scim.spec.filter.Filter;
import org.apache.directory.scim.spec.filter.FilterExpressions;
import org.apache.directory.scim.spec.filter.FilterResponse;
import org.apache.directory.scim.spec.filter.PageRequest;
import org.apache.directory.scim.spec.filter.SortRequest;
import org.apache.directory.scim.spec.resources.Email;
import org.apache.directory.scim.spec.resources.Name;
import org.apache.directory.scim.spec.resources.ScimResource;
import org.apache.directory.scim.spec.resources.ScimUser;
import org.apache.directory.scim.spec.schema.ResourceReference;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.CacheManager;
import org.springframework.stereotype.Service;

@Service
public class ScimUserService implements Repository<ScimUser> {

    private final Logger log = LoggerFactory.getLogger(ScimUserService.class);

    private final SchemaRegistry schemaRegistry;
    private final UserRepository userRepository;

    private final AuthorityRepository authorityRepository;
    private final CacheManager cacheManager;

    public ScimUserService(
        SchemaRegistry schemaRegistry,
        UserRepository userRepository,
        AuthorityRepository authorityRepository,
        CacheManager cacheManager
    ) {
        this.schemaRegistry = schemaRegistry;
        this.userRepository = userRepository;
        this.authorityRepository = authorityRepository;
        this.cacheManager = cacheManager;
    }

    @Override
    public Class<ScimUser> getResourceClass() {
        return ScimUser.class;
    }

    /**
     * @see Repository#create(ScimResource)
     */
    @Override
    public ScimUser create(ScimUser resource) throws UnableToCreateResourceException {
        log.debug("Creating resource: {}", resource);
        // check to make sure the user doesn't already exist
        Optional<User> user = userRepository.findOneByLogin(resource.getUserName());
        if (user.isPresent()) {
            throw new UnableToCreateResourceException(Response.Status.CONFLICT, "User '" + resource.getUserName() + "' already exists.");
        } else {
            resource.setId(resource.getExternalId());
            saveUser(resource);
        }

        return resource;
    }

    private void saveUser(ScimUser scimUser) {
        // save authorities in to sync user roles/groups between IdP and JHipster's local database
        Collection<String> dbAuthorities = authorityRepository.findAll().stream().map(Authority::getName).toList();
        log.debug("authorities from database: " + dbAuthorities);
        Collection<String> userAuthorities = scimUser.getGroups().stream().map(ResourceReference::getValue).toList();
        log.debug("scim.groups: " + scimUser.getGroups());
        log.debug("authorities from scim: " + userAuthorities);

        for (String authority : userAuthorities) {
            if (!dbAuthorities.contains(authority)) {
                log.debug("Saving authority '{}' in local database", authority);
                Authority authorityToSave = new Authority();
                authorityToSave.setName(authority);
                authorityRepository.save(authorityToSave);
            }
        }

        log.debug("Saving user '{}' in local database", scimUser.getUserName());

        User user = new User();
        user.setId(scimUser.getExternalId());
        if (scimUser.getPrimaryEmailAddress().isPresent()) {
            user.setEmail(scimUser.getPrimaryEmailAddress().get().getValue());
        }
        user.setLogin(user.getEmail());
        user.setFirstName(scimUser.getName().getGivenName());
        user.setLastName(scimUser.getName().getFamilyName());
        user.setActivated(scimUser.getActive());
        user.setLangKey(scimUser.getLocale() != null ? scimUser.getLocale() : Constants.DEFAULT_LANGUAGE);
        // trim out country if exists
        if (user.getLangKey().contains("-")) {
            user.setLangKey(user.getLangKey().substring(0, user.getLangKey().indexOf("-")));
        }
        user.setImageUrl(scimUser.getProfileUrl());
        user.setCreatedBy("scimple");

        userRepository.save(user);
        clearUserCaches(user);
    }

    private void clearUserCaches(User user) {
        Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_LOGIN_CACHE)).evict(user.getLogin());
        if (user.getEmail() != null) {
            Objects.requireNonNull(cacheManager.getCache(UserRepository.USERS_BY_EMAIL_CACHE)).evict(user.getEmail());
        }
    }

    /**
     * @see Repository#update(UpdateRequest)
     */
    @Override
    public ScimUser update(UpdateRequest<ScimUser> updateRequest) throws UnableToUpdateResourceException {
        ScimUser resource = updateRequest.getResource();
        saveUser(resource);
        return resource;
    }

    /**
     * @see Repository#get(String)
     */
    @Override
    public ScimUser get(String id) {
        log.debug("get id: {}", id);
        Optional<User> optionalUser = userRepository.findById(id);
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            ScimUser scimUser = new ScimUser();
            scimUser.setEmails(List.of(new Email().setPrimary(true).setValue(user.getEmail())));
            scimUser.setUserName(user.getLogin());
            scimUser.setName(new Name().setGivenName(user.getFirstName()).setFamilyName(user.getLastName()));
            scimUser.setActive(user.isActivated());
            scimUser.setLocale(user.getLangKey());
            scimUser.setProfileUrl(user.getImageUrl());
            return scimUser;
        } else {
            return null;
        }
    }

    /**
     * @see Repository#delete(String)
     */
    @Override
    public void delete(String id) {
        log.debug("delete id: {} ", id);
        userRepository.deleteById(id);
    }

    /**
     * @see Repository#find(Filter, PageRequest, SortRequest)
     */
    @Override
    public FilterResponse<ScimUser> find(Filter filter, PageRequest pageRequest, SortRequest sortRequest) {
        log.debug("filter: {}, page: {}, sort: {}", filter, pageRequest, sortRequest);
        // todo: use filters and paging/sorting

        long count = pageRequest.getCount() != null ? pageRequest.getCount() : userRepository.count();
        long startIndex = pageRequest.getStartIndex() != null
            ? pageRequest.getStartIndex() - 1 // SCIM is 1-based indexed
            : 0;

        List<ScimUser> result = userRepository
            .findAll()
            .stream()
            .map(user -> {
                ScimUser scimUser = new ScimUser();
                scimUser.setUserName(user.getLogin());
                scimUser.setExternalId(user.getLogin());
                scimUser.setName(new Name().setFamilyName(user.getLastName()).setGivenName(user.getFirstName()));
                scimUser.setEmails(List.of(new Email().setValue(user.getEmail()).setPrimary(true)));
                List<ResourceReference> groups = List.of();
                user.getAuthorities().stream().map(authority -> groups.add(new ResourceReference().setValue(authority.getName())));
                scimUser.setGroups(groups);
                return scimUser;
            })
            .skip(startIndex)
            .limit(count)
            .filter(FilterExpressions.inMemory(filter, schemaRegistry.getSchema(ScimUser.SCHEMA_URI)))
            .collect(Collectors.toList());

        return new FilterResponse<>(result, pageRequest, result.size());
    }
}
