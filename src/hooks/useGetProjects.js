import Project from "../project";
import Settings from "../settings";
import service from "../service";
import { useContext } from "../Context/providers/contextProvider";

function useGetProjects() {
  const [state, dispatch] = useContext();

  const handleGetProjects = async (callback) => {
    const projects = await service.getProjects().catch((err) => err);

    if (!projects.data) {
      console.log("Network error");
      callback(false);
    }

    if (projects.data.length > 0) {
      Settings.projects = [...projects.data];

      const project = await service
        .getProject(projects.data[0].project)
        .catch((err) => err);

      if (!project.data) {
        console.log("project not found");
        callback(false);
      }

      dispatch({
        type: "SET_PROJECT",
        payload: { project: JSON.parse(project.data.context) },
      });
      Project.setWithoutStringify(
        project.data.project,
        project.data.name,
        project.data.context
      );
      callback(true);
    } else {
      const { name, context } = Project.getStringify();
      service.addProject(name, context).then(({ data }) => {
        Settings.projects = [{ project: data, name }];
        Project.setWithoutStringify(data, name, context);
        callback(true);
      });
    }
  };

  return [state, dispatch, handleGetProjects];
}

export default useGetProjects;
