import { useEffect } from 'react';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useDispatch, useSelector } from 'react-redux';
import { setIsZoneSelectorOpen } from '../store/slices/isZoneSelectorOpen.slice';
import { setSelectedZone } from '../store/slices/selectedZone.slice';
import { getZoneSelectedThunk } from '../store/slices/myZones.slice';

const SelectZones = ()=>{

    const zones =  useSelector( state => state.myZones )
    const dispatch = useDispatch()
    const selectedZone = useSelector( state => state.selectedZone )
    const isZoneSelectorOpen = useSelector( state => state.isZoneSelectorOpen )

    useEffect(()=>{
        dispatch(getZoneSelectedThunk())
    },[])

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
                value={selectedZone.idzonas}
            >
                {zones.map((zone, index) => (
                <FormControlLabel
                    value={zone.idzonas}
                    key={index}
                    control={<Radio />}
                    label={zone.name}
                    onClick={ ()=> dispatch( setSelectedZone(zone) ) }
                />
                ))}
            </RadioGroup>
            </DialogContent>
            <DialogActions>
            <Button
                onClick={()=>dispatch( setIsZoneSelectorOpen(false) )}
            >Ok</Button>
            </DialogActions>
        </Dialog>
    )
}

export default SelectZones