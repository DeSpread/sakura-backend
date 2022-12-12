import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProjectService } from '../../database/service/project.service';
import { Project } from '../../schema/project.schema';
import { ProjectInput } from '../dto/project.dto';

@Resolver(() => Project)
export class ProjectResolver {
  constructor(private readonly projectService: ProjectService) {}

  @Query(() => [Project])
  async projects() {
    return this.projectService.findAll();
  }

  @Query(() => [Project])
  async project(@Args('projectName') projectName: string) {
    return this.projectService.findAllByName(projectName);
  }

  @Mutation(() => Project)
  async createProject(@Args() projectInput: ProjectInput) {
    return this.projectService.create(projectInput);
  }

  // @Mutation(() => Project)
  // async updateProject(projectId: string, @Args() projectInput: ProjectInput) {
  //   return this.projectService.update(projectId, projectInput);
  // }

  @Mutation(() => Project)
  async removeProject(@Args('projectId') projectId: string) {
    return this.projectService.remove(projectId);
  }
}