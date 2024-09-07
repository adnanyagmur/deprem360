/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from '@mui/material';

type Message = {
    role: 'system' | 'user';
    content: string;
  };
  
  type RequestDataProps = {
    model: string;
    messages: Message[];
    temperature: number;
    top_p: number;
    skip_special_tokens: boolean;
    repetition_penalty: number;
    max_tokens: number;
  };
interface LlmFeadBackDialogProps {
  open: boolean;
  onClose: () => void;
  response: any;
  onSubmitFeedback: (feedback: any) => void;
  requestData: RequestDataProps; // LLM'ye gönderilen requestData props olarak alınacak
}

const buttonStyle = { backgroundColor: '#263959', color: '#ffffff', '&:hover': { backgroundColor: '#1d2d46' } };
const radioStyle = {
  color: '#263959', // Radio'nun varsayılan rengi
  '&.Mui-checked': {
    color: '#263959', // Seçildiğinde radio butonunun rengi
  }
};

const LlmFeadBackDialog: React.FC<LlmFeadBackDialogProps> = ({ open, onClose, response, onSubmitFeedback, requestData }) => {
    const [rating, setRating] = useState<string>('like');
    const [feedbackText, setFeedbackText] = useState<string>('');
    const [preferredResponse, setPreferredResponse] = useState<string>('');
  
    // Geri bildirim formatına uygun şekilde verileri oluşturma
    const handleSubmit = () => {
      const feedback = {
        interaction_id: response?.id || 'unknown', // response'dan gelen interaction id'yi kullanıyoruz
        user_id: 'user_001', // Varsayılan user ID
        timestamp: new Date().toISOString(), // Zaman damgası
        content_generated: {
          input_prompt: requestData?.messages[1]?.content || 'No prompt available', // LLM'ye gönderilen user mesajını requestData'dan alıyoruz
          response: response?.choices?.[0]?.message?.content || 'No response available', // Asistan yanıtı kontrol ediliyor
        },
        user_feedback: {
          rating, // Kullanıcının verdiği puan
          feedback_text: feedbackText, // Geri bildirim metni
          preferred_response: preferredResponse, // Kullanıcının tercih ettiği yanıt
        },
        feedback_metadata: {
          device: 'desktop', // Varsayılan cihaz
          location: 'Berlin, Almanya', // Varsayılan konum (bunu dinamik yapabilirsiniz)
          session_duration: 45, // Örneğin 45 saniyelik bir oturum
        }
      };
  
      console.log('Geri bildirim:', feedback); // Kontrol amaçlı log
  
      // LocalStorage'a kaydet
      const existingFeedbacks = JSON.parse(localStorage.getItem('feedbacks') || '[]');
      existingFeedbacks.push(feedback);
      localStorage.setItem('feedbacks', JSON.stringify(existingFeedbacks));
  
      onSubmitFeedback(feedback);
      onClose();
    };
  
    const handleRatingChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setRating(value);
      if (value === 'like') {
        handleSubmit(); // Beğendim seçilirse, form otomatik olarak kapanır
      }
    };
  
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
            <Typography variant="h6">Asistan Yanıtı:</Typography>
            {/* Kontrol edilerek response içeriği yazdırılıyor */}
            <Typography variant="body1">
              {response?.choices?.[0]?.message?.content || 'Yanıt bulunamadı'}
            </Typography>
  
            <FormControl component="fieldset" style={{ marginTop: '20px' }}>
              <FormLabel component="legend">
                 <Typography variant='h6'>Cevabı beğendiniz mi?</Typography> 
              </FormLabel>
              <RadioGroup
                aria-label="rating"
                name="rating"
                value={rating}
                onChange={handleRatingChange}
              >
                <FormControlLabel
                  value="like"
                  control={<Radio sx={radioStyle} />}
                  label="Beğendim"
                />
                <FormControlLabel
                  value="dislike"
                  control={<Radio sx={radioStyle} />}
                  label="Beğenmedim"
                />
              </RadioGroup>
            </FormControl>
  
            {rating === 'dislike' && (
              <>
                <Typography variant="body2" style={{ marginTop: '15px' }}>
                  Beğenmediyseniz geri bildirim vererek daha iyi olmamıza yardımcı olur musunuz?
                </Typography>
  
                <TextField
                  label="Geri Bildiriminiz"
                  fullWidth
                  multiline
                  rows={4}
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  style={{ marginTop: '10px' }}
                  variant="outlined"
                />
  
                <TextField
                  label="Tercih Ettiğiniz Yanıt"
                  fullWidth
                  multiline
                  rows={2}
                  value={preferredResponse}
                  onChange={(e) => setPreferredResponse(e.target.value)}
                  style={{ marginTop: '10px' }}
                  variant="outlined"
                />
              </>
            )}
          </div>
        </DialogContent>
        {rating === 'dislike' && (
          <DialogActions>
            <Button onClick={onClose} sx={buttonStyle}>İptal</Button>
            <Button onClick={handleSubmit} sx={buttonStyle}>Geri Bildirim Gönder</Button>
          </DialogActions>
        )}
      </Dialog>
    );
  };
  
  export default LlmFeadBackDialog;