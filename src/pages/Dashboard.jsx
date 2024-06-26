import {EuiFlexGroup,EuiCard, EuiFlexItem, EuiImage } from "@elastic/eui";
import Header from "../component/Header";
import dashboard1 from "../assets/dashboard1.png";
import dashboard2 from "../assets/dashboard2.png";
import dashboard3 from "../assets/dashboard3.png";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";
function Dashboard(){
    useAuth();
    const navigate = useNavigate();
    return(
        <div style={{
            display: "flex",
            height:"100vh",
            flexDirection: "column",
            }}>
            <Header/>
            <EuiFlexGroup
          justifyContent="center"
          alignItems="center"
          style={{ margin: "5vh 10vw" }}
        >
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage src={dashboard1} alt="icon" size="5rem" />}
              title={`Create Meeting`}
              description="Create a new meeting and invite people."
              paddingSize="xl"
              onClick={() => navigate("/create")}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage src={dashboard2} alt="icon" size="100%" />}
              title={`My Meetings`}
              description="View your created meetings."
              paddingSize="xl"
              onClick={() => navigate("/my-meetings")}
            />
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiCard
              icon={<EuiImage src={dashboard3} alt="icon" size="5rem" />}
              title={`Meetings`}
              description="View the meetings that you are invited to."
              paddingSize="xl"
              onClick={() => navigate("/meetings")}
            />
          </EuiFlexItem>
        </EuiFlexGroup>
        </div>
    )
}
export default Dashboard