import Project from "../project";
import Settings from "../settings";
import service from "../service";
import { useContext } from "../context/context";

function useService() {
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
        Settings.projects = [{ project: data.project, name: data.name }];
        dispatch({
          type: "SET_PROJECT",
          payload: { project: JSON.parse(data.context) },
        });
        Project.setWithoutStringify(data.project, data.name, data.context);
        callback(true);
      });
    }
  };

  const handleSaveProject = (callback) => {
    const { project, name } = Project.getStringify();
    const context = JSON.stringify(state);

    if (!project) {
      return handleGetProjects(() => callback(false));
    } else {
      service
        .updateProject(project, name, context)
        .then((data) => {
          callback(data);
        })
        .catch(() => {
          callback(false);
        });
    }
  };

  return [state, dispatch, handleGetProjects, handleSaveProject];
}

export default useService;
