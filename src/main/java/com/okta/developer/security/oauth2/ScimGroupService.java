package com.okta.developer.security.oauth2;

import com.okta.developer.domain.Authority;
import com.okta.developer.domain.User;
import com.okta.developer.repository.AuthorityRepository;
import com.okta.developer.repository.UserRepository;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.apache.directory.scim.core.repository.Repository;
import org.apache.directory.scim.core.repository.UpdateRequest;
import org.apache.directory.scim.core.schema.SchemaRegistry;
import org.apache.directory.scim.spec.exception.ResourceException;
import org.apache.directory.scim.spec.filter.Filter;
import org.apache.directory.scim.spec.filter.FilterExpressions;
import org.apache.directory.scim.spec.filter.FilterResponse;
import org.apache.directory.scim.spec.filter.PageRequest;
import org.apache.directory.scim.spec.filter.SortRequest;
import org.apache.directory.scim.spec.resources.Email;
import org.apache.directory.scim.spec.resources.Name;
import org.apache.directory.scim.spec.resources.ScimGroup;
import org.apache.directory.scim.spec.resources.ScimUser;
import org.apache.directory.scim.spec.schema.ResourceReference;
import org.checkerframework.checker.units.qual.A;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ScimGroupService implements Repository<ScimGroup> {

    private final Logger log = LoggerFactory.getLogger(ScimGroupService.class);

    private final AuthorityRepository authorityRepository;

    private final UserRepository userRepository;

    private final SchemaRegistry schemaRegistry;

    @Override
    public Class<ScimGroup> getResourceClass() {
        return ScimGroup.class;
    }

    public ScimGroupService(AuthorityRepository authorityRepository, UserRepository userRepository, SchemaRegistry schemaRegistry) {
        this.authorityRepository = authorityRepository;
        this.userRepository = userRepository;
        this.schemaRegistry = schemaRegistry;
    }

    @Override
    @Transactional
    public ScimGroup create(ScimGroup scimGroup) throws ResourceException {
        return createOrUpdateGroup(scimGroup);
    }

    @Override
    @Transactional
    public ScimGroup update(UpdateRequest<ScimGroup> updateRequest) throws ResourceException {
        log.debug("todo: updating {}", updateRequest);

        return createOrUpdateGroup(updateRequest.getResource());
    }

    @Override
    public ScimGroup get(String s) throws ResourceException {
        log.debug("get() with {}", s);
        return authorityRepository.findByName(s).map(authority -> toScimGroup(authority.getName())).orElse(null);
    }

    @Override
    public FilterResponse<ScimGroup> find(Filter filter, PageRequest pageRequest, SortRequest sortRequest) {
        log.debug("filter: {}, page: {}, sort: {}", filter, pageRequest, sortRequest);
        // todo: use filters and paging/sorting

        long count = pageRequest.getCount() != null ? pageRequest.getCount() : authorityRepository.count();
        long startIndex = pageRequest.getStartIndex() != null
            ? pageRequest.getStartIndex() - 1 // SCIM is 1-based indexed
            : 0;

        List<ScimGroup> result = authorityRepository
            .findAll()
            .stream()
            .map(authority -> toScimGroup(authority.getName()))
            .skip(startIndex)
            .limit(count)
            .filter(FilterExpressions.inMemory(filter, schemaRegistry.getSchema(ScimGroup.SCHEMA_URI)))
            .collect(Collectors.toList());

        return new FilterResponse<>(result, pageRequest, result.size());
    }

    @Override
    public void delete(String s) throws ResourceException {
        authorityRepository.delete(new Authority(s));
    }

    private ScimGroup createOrUpdateGroup(ScimGroup scimGroup) {
        String groupId = scimGroup.getDisplayName();
        scimGroup.setId(groupId);
        authorityRepository.save(new Authority(groupId));

        scimGroup
            .getMembers()
            .stream()
            .forEach(memberRef -> {
                // Assume these are always userIds, but per spec they could be groupIds (Okta only supports users here)
                String id = memberRef.getValue();
                Optional<User> optionalUser = userRepository.findById(id);
                optionalUser.ifPresentOrElse(
                    user -> {
                        user.getAuthorities().add(new Authority(groupId));
                        // TODO: user cache needs to be invalidated, so new groups/authorities are loaded
                        userRepository.save(user);
                    },
                    () -> log.warn("User {}, was not found, could not assign group: {}", id, groupId)
                );
            });

        return scimGroup;
    }

    private ScimGroup toScimGroup(String name) {
        ScimGroup scimGroup = new ScimGroup();
        scimGroup.setId(name);
        scimGroup.setDisplayName(name);

        // TODO add group members
        return scimGroup;
    }
}
