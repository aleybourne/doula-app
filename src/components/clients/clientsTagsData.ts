export interface Tag {
  id: string;
  label: string;
  description: string;
  color: string;
  checked: boolean;
}

export interface ClientTagsInfo {
  [clientName: string]: Tag[];
}

export const clientsTags: ClientTagsInfo = {
  "Sam Williams": [
    {
      id: "initial-contact",
      label: "Initial Contact",
      description: "First meeting and consultation completed",
      color: "bg-[#A085E9]",
      checked: true
    },
    {
      id: "birth-preferences",
      label: "Birth Preferences",
      description: "Birth plan discussion pending",
      color: "bg-[#82A7E2]",
      checked: false
    }
  ],
  "Benita Mendez": [
    {
      id: "initial-contact",
      label: "Initial Contact",
      description: "First meeting and consultation completed",
      color: "bg-[#A085E9]",
      checked: true
    },
    {
      id: "payment-plan",
      label: "Payment Plan",
      description: "Payment plan agreed and initiated",
      color: "bg-[#F499B7]",
      checked: true
    },
    {
      id: "doula-agreement",
      label: "Doula Agreement",
      description: "Doula service agreement signed",
      color: "bg-[#A7EBB1]",
      checked: true
    }
  ],
  "Julie Hill": [
    {
      id: "initial-contact",
      label: "Initial Contact",
      description: "First meeting and consultation completed",
      color: "bg-[#A085E9]",
      checked: true
    },
    {
      id: "birth-preferences",
      label: "Birth Preferences",
      description: "Birth plan discussion pending",
      color: "bg-[#82A7E2]",
      checked: false
    },
    {
      id: "virtual-consult",
      label: "Virtual Consult",
      description: "Virtual consultation scheduled",
      color: "bg-[#F499B7]",
      checked: true
    }
  ],
  "Jasmine Jones": [
    {
      id: "initial-contact",
      label: "Initial Contact",
      description: "First meeting and consultation completed",
      color: "bg-[#A085E9]",
      checked: true
    },
    {
      id: "payment-plan",
      label: "Payment Plan",
      description: "Payment plan agreed and initiated",
      color: "bg-[#F499B7]",
      checked: true
    },
    {
      id: "doula-agreement",
      label: "Doula Agreement",
      description: "Doula service agreement signed",
      color: "bg-[#A7EBB1]",
      checked: true
    }
  ],
  "Jane Miller": [
    {
      id: "initial-contact",
      label: "Initial Contact",
      description: "First meeting and consultation completed",
      color: "bg-[#A085E9]",
      checked: true
    },
    {
      id: "birth-preferences",
      label: "Birth Preferences",
      description: "Birth plan discussion pending",
      color: "bg-[#82A7E2]",
      checked: false
    }
  ],
  "Austin Leybourne": []
};
