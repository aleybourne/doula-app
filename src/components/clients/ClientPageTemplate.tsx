
import React from "react";
import { Tag } from "./clientsTagsData";
import { ClientData } from "./types/ClientTypes";
import ClientHeader from "./page/ClientHeader";
import ClientProgress from "./page/ClientProgress";
import ClientStatus from "./page/ClientStatus";
import ClientMeeting from "./page/ClientMeeting";
import ClientQuickLinks from "./page/ClientQuickLinks";
import ClientProgressBar from "./page/ClientProgressBar";
import ClientBirthPlans from "./page/ClientBirthPlans";
import ClientAlertButton from "./page/ClientAlertButton";
import { calculateGestationAndTrimester } from "./utils/gestationUtils";
import { markClientDelivered } from "./store/clientActions";

interface ClientInfo extends ClientData {
  bgColor: string;
  tags: Tag[];
}

interface ClientPageTemplateProps {
  clientInfo: ClientInfo;
}

const ClientPageTemplate: React.FC<ClientPageTemplateProps> = ({ clientInfo }) => {
  const [expanded, setExpanded] = React.useState(false);
  
  const { 
    gestation, 
    trimester, 
    progress, 
    isPastDue, 
    isPostpartum, 
    postpartumProgress 
  } = calculateGestationAndTrimester(
    clientInfo.dueDateISO, 
    clientInfo.status, 
    clientInfo.deliveryDate
  );

  // Log client info for debugging
  React.useEffect(() => {
    console.log("ClientPageTemplate received client data:", clientInfo);
    if (isPostpartum) {
      console.log("Client is in postpartum period with progress:", postpartumProgress);
    }
  }, [clientInfo, isPostpartum, postpartumProgress]);

  return (
    <div className="min-h-screen bg-white pb-4 flex flex-col max-w-md mx-auto">
      <ClientHeader />
      
      <ClientProgress
        name={clientInfo.name}
        image={clientInfo.image}
        bgColor={clientInfo.bgColor}
        gestation={gestation}
        trimester={trimester || ""}
        progress={progress}
        isPastDue={isPastDue}
        isPostpartum={isPostpartum}
        postpartumProgress={postpartumProgress}
        expanded={expanded}
        setExpanded={setExpanded}
        tags={clientInfo.tags}
        status={clientInfo.status}
      />

      <ClientStatus 
        dueDateLabel={clientInfo.dueDateLabel}
        onDelivered={markClientDelivered}
        client={clientInfo}
      />

      <ClientMeeting />
      <ClientQuickLinks />
      <ClientProgressBar />
      <ClientBirthPlans />
      <ClientAlertButton />
    </div>
  );
};

export default ClientPageTemplate;
