
import React from "react";
import ConfettiExplosion from "react-confetti-explosion";
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
import ActiveLaborNotes from "./page/ActiveLaborNotes";
import PostpartumNotes from "./page/PostpartumNotes";
import ClientJournal from "./page/ClientJournal";
import ClientDocuments from "./page/ClientDocuments";
import { calculateGestationAndTrimester } from "./utils/gestationUtils";

interface ClientInfo extends ClientData {
  bgColor: string;
  tags: Tag[];
}

interface ClientPageTemplateProps {
  clientInfo: ClientInfo;
}

const ClientPageTemplate: React.FC<ClientPageTemplateProps> = ({ clientInfo }) => {
  const [expanded, setExpanded] = React.useState(false);
  const [isJournalOpen, setIsJournalOpen] = React.useState(false);
  const [isDocumentsOpen, setIsDocumentsOpen] = React.useState(false);
  const [showConfetti, setShowConfetti] = React.useState(false);

  const triggerConfetti = () => {
    setShowConfetti(true);
    // Auto-hide confetti after animation completes
    setTimeout(() => setShowConfetti(false), 4000);
  };
  
  // Add safety check for clientInfo
  if (!clientInfo || !clientInfo.id) {
    console.error("ClientPageTemplate: Invalid clientInfo provided", clientInfo);
    return (
      <div className="min-h-screen bg-white pb-4 flex flex-col max-w-md mx-auto">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-600 mb-2">Error Loading Client</h2>
            <p className="text-gray-600">Invalid client data provided.</p>
          </div>
        </div>
      </div>
    );
  }
  
  const { 
    gestation, 
    trimester, 
    progress, 
    isPastDue, 
    isPostpartum, 
    postpartumProgress 
  } = calculateGestationAndTrimester(
    clientInfo.dueDateISO, 
    clientInfo.birthStage, 
    clientInfo.deliveryDate
  );

  // Log client info for debugging
  React.useEffect(() => {
    console.log("ClientPageTemplate received client data:", clientInfo);
    if (isPostpartum) {
      console.log("Client is in postpartum period with progress:", postpartumProgress);
    }
  }, [clientInfo.id]); // Only depend on ID to prevent infinite re-renders

  return (
    <div className="min-h-screen bg-white pb-4 flex flex-col max-w-md mx-auto">
      <ClientHeader client={clientInfo} />
      
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
        client={clientInfo}
        onTriggerConfetti={triggerConfetti}
      />

      {/* Stage-specific content */}
      {(clientInfo.birthStage === 'active-labor') && (
        <ActiveLaborNotes client={clientInfo} />
      )}

      <ClientMeeting />
      <ClientQuickLinks 
        client={clientInfo}
        onJournalClick={() => setIsJournalOpen(true)}
        onDocumentsClick={() => setIsDocumentsOpen(true)}
      />
      
      <ClientProgressBar />
      <ClientBirthPlans />
      <ClientAlertButton />

      {/* Journal Modal */}
      <ClientJournal 
        client={clientInfo}
        isOpen={isJournalOpen}
        onClose={() => setIsJournalOpen(false)}
      />

      {/* Documents Modal */}
      <ClientDocuments 
        client={clientInfo}
        isOpen={isDocumentsOpen}
        onClose={() => setIsDocumentsOpen(false)}
      />

      {/* Full-page confetti celebration */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <ConfettiExplosion
            force={0.8}
            duration={3500}
            particleCount={200}
            width={1600}
            height={1200}
            colors={['#FFB6C1', '#87CEEB', '#FFE4B5', '#98FB98', '#DDA0DD', '#F0E68C']}
          />
        </div>
      )}
    </div>
  );
};

export default ClientPageTemplate;
