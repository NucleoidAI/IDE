import Project from "../project";
import Settings from "../settings";
import service from "../service";
import { useContext } from "../Context/providers/contextProvider";
import { useLayoutContext } from "../Context/providers/layoutContextProvider";

function useService() {
  const [state, dispatch] = useContext();
  const [, layoutDispatch] = useLayoutContext();

  const handleGetProjects = async (callback) => {
    layoutDispatch({ type: "BACKDROP", payload: { status: true } });

    const projects = await service.getProjects().catch((err) => err);

    if (!projects.data) {
      console.log("Network error");
    }

    if (projects.data.length > 0) {
      Settings.projects = [...projects.data];

      const project = await service
        .getProject(projects.data[0].project)
        .catch((err) => err);

      if (!project.data) {
        console.log("project not found");
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
    } else {
      const { name, context } = Project.getStringify();
      service.addProject(name, context).then(({ data }) => {
        Settings.projects = [{ project: data.project, name: data.name }];
        dispatch({
          type: "SET_PROJECT",
          payload: { project: JSON.parse(data.context) },
        });
        Project.setWithoutStringify(data.project, data.name, data.context);
      });
    }

    layoutDispatch({ type: "BACKDROP", payload: { status: false } });
  };

  const handleSaveProject = (callback) => {
    const { project, name } = Project.getStringify();
    const context = JSON.stringify(state);
    layoutDispatch({ type: "SAVE_STATUS", payload: { status: true } });

    if (!project) {
      return handleGetProjects(() => {
        layoutDispatch({ type: "SAVE_STATUS", payload: { status: false } });
      });
    } else {
      service
        .updateProject(project, name, context)
        .then((data) => {
          layoutDispatch({ type: "SAVE_STATUS", payload: { status: false } });
        })
        .catch(() => {
          layoutDispatch({ type: "SAVE_STATUS", payload: { status: false } });
        });
    }
  };

  return [state, dispatch, handleGetProjects, handleSaveProject];
}

export default useService;
