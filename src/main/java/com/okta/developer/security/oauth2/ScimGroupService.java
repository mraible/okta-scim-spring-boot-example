package com.okta.developer.security.oauth2;

import com.okta.developer.repository.AuthorityRepository;
import java.util.List;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

@Service
public class ScimGroupService implements Repository<ScimGroup> {

    private final Logger log = LoggerFactory.getLogger(ScimGroupService.class);

    private final AuthorityRepository authorityRepository;

    private final SchemaRegistry schemaRegistry;

    @Override
    public Class<ScimGroup> getResourceClass() {
        return ScimGroup.class;
    }

    public ScimGroupService(AuthorityRepository authorityRepository, SchemaRegistry schemaRegistry) {
        this.authorityRepository = authorityRepository;
        this.schemaRegistry = schemaRegistry;
    }

    @Override
    public ScimGroup create(ScimGroup scimGroup) throws ResourceException {
        // check if authority exists
        log.debug("check if authority exists, if not, create");
        return scimGroup;
    }

    @Override
    public ScimGroup update(UpdateRequest<ScimGroup> updateRequest) throws ResourceException {
        log.debug("todo: updating");
        return updateRequest.getResource();
    }

    @Override
    public ScimGroup get(String s) throws ResourceException {
        // who the hell knows
        log.debug("get() with {}", s);
        return new ScimGroup();
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
            .map(authority -> {
                ScimGroup scimGroup = new ScimGroup();
                scimGroup.setDisplayName(authority.getName());
                return scimGroup;
            })
            .skip(startIndex)
            .limit(count)
            .filter(FilterExpressions.inMemory(filter, schemaRegistry.getSchema(ScimUser.SCHEMA_URI)))
            .collect(Collectors.toList());

        return new FilterResponse<>(result, pageRequest, result.size());
    }

    @Override
    public void delete(String s) throws ResourceException {
        log.debug("delete...");
    }
}
