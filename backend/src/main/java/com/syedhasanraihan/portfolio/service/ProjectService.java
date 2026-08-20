package com.syedhasanraihan.portfolio.service;

import com.syedhasanraihan.portfolio.common.ConflictException;
import com.syedhasanraihan.portfolio.common.NotFoundException;
import com.syedhasanraihan.portfolio.dto.common.PageResult;
import com.syedhasanraihan.portfolio.dto.common.ReorderItem;
import com.syedhasanraihan.portfolio.dto.project.AttachProjectImageRequest;
import com.syedhasanraihan.portfolio.dto.project.ProjectRequest;
import com.syedhasanraihan.portfolio.dto.project.ProjectResponse;
import com.syedhasanraihan.portfolio.entity.Media;
import com.syedhasanraihan.portfolio.entity.Project;
import com.syedhasanraihan.portfolio.entity.ProjectImage;
import com.syedhasanraihan.portfolio.repository.MediaRepository;
import com.syedhasanraihan.portfolio.repository.ProjectRepository;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final MediaRepository mediaRepository;

    public ProjectService(ProjectRepository projectRepository, MediaRepository mediaRepository) {
        this.projectRepository = projectRepository;
        this.mediaRepository = mediaRepository;
    }

    @Transactional(readOnly = true)
    public List<ProjectResponse> listPublic(String category, Boolean featured) {
        return projectRepository.findPublicProjects(category, featured).stream().map(ProjectResponse::from).toList();
    }

    @Transactional(readOnly = true)
    public ProjectResponse getPublicBySlug(String slug) {
        return ProjectResponse.from(projectRepository.findBySlug(slug)
                .orElseThrow(() -> new NotFoundException("Project not found: " + slug)));
    }

    @Transactional(readOnly = true)
    public PageResult<ProjectResponse> listAdmin(String search, String category, Pageable pageable) {
        return PageResult.from(projectRepository.searchAdminProjects(search, category, pageable), ProjectResponse::from);
    }

    @Transactional(readOnly = true)
    public ProjectResponse getById(Long id) {
        return ProjectResponse.from(findEntity(id));
    }

    @Transactional
    public ProjectResponse create(ProjectRequest request) {
        Project project = new Project();
        applyRequest(project, request, true);
        if (request.orderIndex() == null) {
            project.setOrderIndex((int) projectRepository.countBy());
        }
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse update(Long id, ProjectRequest request) {
        Project project = findEntity(id);
        applyRequest(project, request, false);
        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public void delete(Long id) {
        projectRepository.delete(findEntity(id));
    }

    @Transactional
    public void reorder(List<ReorderItem> items) {
        Map<Long, Integer> orderByIdMap = items.stream()
                .collect(java.util.stream.Collectors.toMap(ReorderItem::id, ReorderItem::orderIndex));
        List<Project> projects = projectRepository.findAllById(orderByIdMap.keySet());
        for (Project project : projects) {
            project.setOrderIndex(orderByIdMap.get(project.getId()));
        }
        projectRepository.saveAll(projects);
    }

    @Transactional
    public ProjectResponse attachImage(Long projectId, AttachProjectImageRequest request) {
        Project project = findEntity(projectId);
        Media media = mediaRepository.findById(request.mediaId())
                .orElseThrow(() -> NotFoundException.of("Media", request.mediaId()));

        if (Boolean.TRUE.equals(request.cover())) {
            project.getImages().forEach(img -> img.setCover(false));
        }

        ProjectImage image = new ProjectImage();
        image.setProject(project);
        image.setMedia(media);
        image.setOrderIndex(request.orderIndex() != null ? request.orderIndex() : project.getImages().size());
        image.setCover(Boolean.TRUE.equals(request.cover()));
        project.getImages().add(image);

        return ProjectResponse.from(projectRepository.save(project));
    }

    @Transactional
    public ProjectResponse detachImage(Long projectId, Long projectImageId) {
        Project project = findEntity(projectId);
        project.getImages().removeIf(img -> img.getId().equals(projectImageId));
        return ProjectResponse.from(projectRepository.save(project));
    }

    private void applyRequest(Project project, ProjectRequest request, boolean isCreate) {
        project.setTitle(request.title());

        String slug = (request.slug() != null && !request.slug().isBlank())
                ? slugify(request.slug())
                : slugify(request.title());
        boolean slugChanged = isCreate || !slug.equals(project.getSlug());
        if (slugChanged) {
            projectRepository.findBySlug(slug).ifPresent(existing -> {
                if (isCreate || !existing.getId().equals(project.getId())) {
                    throw new ConflictException("A project with slug '" + slug + "' already exists");
                }
            });
        }
        project.setSlug(slug);

        project.setSummary(request.summary());
        project.setDescription(request.description());
        project.setClientName(request.clientName());
        project.setCategory(request.category());
        project.setStatus(request.status() != null ? Project.Status.valueOf(request.status()) : Project.Status.COMPLETED);
        project.setRepoUrl(request.repoUrl());
        project.setLiveUrl(request.liveUrl());
        project.setFeatured(Boolean.TRUE.equals(request.featured()));
        if (request.orderIndex() != null) {
            project.setOrderIndex(request.orderIndex());
        }
        project.setStartDate(request.startDate());
        project.setEndDate(request.endDate());
        project.setTechStack(request.techStack() != null ? new ArrayList<>(request.techStack()) : new ArrayList<>());
    }

    private String slugify(String input) {
        return input.toLowerCase()
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
    }

    private Project findEntity(Long id) {
        return projectRepository.findById(id).orElseThrow(() -> NotFoundException.of("Project", id));
    }
}
