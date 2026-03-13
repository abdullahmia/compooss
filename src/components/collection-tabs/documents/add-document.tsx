import { JsonEditor } from "@/components/json-editor";
import { Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@/components/ui/modal/modal";
import { addDocuments } from "@/lib/services/document/document.service";
import { Plus } from "lucide-react";
import { useState } from "react";


const NEW_DOCUMENT_TEMPLATE = `
{
  "_id": {
    "$oid": "69b2cc67aed9c54775ea5563"
  }
}`;

export const AddDocument = () => {
  const [open, setOpen]= useState<boolean>(false);
  const [newDocJson, setNewDocJson] = useState(NEW_DOCUMENT_TEMPLATE);

  const handleToggleModal = () => {
    setOpen(!open)
  }

  const dbName = "test"
  const collectionName = "test"

  const handleAddDocuments = async () => {
    const document = JSON.parse(newDocJson);
    await addDocuments(dbName, collectionName, document)
    setOpen(false)
    setNewDocJson(NEW_DOCUMENT_TEMPLATE)
  }

  return (
    <div>
      <button
            className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
            type="button"
            onClick={handleToggleModal}
          >
            <Plus className="h-3.5 w-3.5" />
            Add Data
          </button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalContent size="lg">
          <ModalHeader
            title={`Add documents to ${dbName}.${collectionName}`}
            onClose={() => setOpen(false)}
          />
          <ModalBody>
            <p className="text-xs text-muted-foreground">
              Paste one or more MongoDB documents as JSON. Comments are allowed
              and will be ignored. If you provide a single document, it will be
              wrapped and inserted. An <code>_id</code> will be generated if
              missing.
            </p>
            <div className="mt-2">
              <JsonEditor value={newDocJson} onChange={setNewDocJson} />
            </div>
          </ModalBody>
          <ModalFooter>
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded-sm border border-border text-muted-foreground hover:bg-muted transition-colors"
              onClick={() => setOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="text-xs px-3 py-1.5 rounded-sm bg-primary text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              onClick={handleAddDocuments}
            >
              Insert documents
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  )
}