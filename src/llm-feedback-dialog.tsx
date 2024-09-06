import React from 'react';
import { Dialog, DialogTitle, DialogContent } from '@mui/material';

interface LlmFeadBackDialogProps {
  open: boolean;
  onClose: () => void;
  response: any;
}

const LlmFeadBackDialog: React.FC<LlmFeadBackDialogProps> = ({ open, onClose, response }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="response-dialog"
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle id="response-dialog">Yanıt Bilgisi</DialogTitle>
      <DialogContent>
        <div>
          <h4>Yanıt:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default LlmFeadBackDialog;
