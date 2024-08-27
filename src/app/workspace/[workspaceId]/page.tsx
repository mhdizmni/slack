interface Props {
    params: {
        workspaceId: string;
    }
}
const WorkspaceIdPage = ({ params }: Props) => {
    return (
        <div>
            <h1>Workspace ID: {params.workspaceId}</h1>
        </div>
    );
}
 
export default WorkspaceIdPage;