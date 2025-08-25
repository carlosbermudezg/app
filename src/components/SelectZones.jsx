import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';

const SelectZones = ({zones, isZoneSelectorOpen = false, setIsZoneSelectorOpen, selectedZone, setSelectedZone})=>{

    return(
        <Dialog
                sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
                maxWidth="xs"
                open={isZoneSelectorOpen}
            >
            <DialogTitle>Elije una Zona</DialogTitle>
            <DialogContent dividers>
            <RadioGroup
                aria-label="zone"
                name="zone"
                value={selectedZone?.idzonas}
            >
                {zones?.map((zone, index) => (
                <FormControlLabel
                    value={zone.idzonas}
                    key={index}
                    control={<Radio />}
                    label={zone.name}
                    onClick={ ()=> setSelectedZone(zone)}
                />
                ))}
            </RadioGroup>
            </DialogContent>
            <DialogActions>
            <Button
                onClick={()=>setIsZoneSelectorOpen(false)}
            >Ok</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SelectZones