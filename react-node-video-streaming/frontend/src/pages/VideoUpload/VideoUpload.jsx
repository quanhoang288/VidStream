import React from 'react';
import PropTypes from 'prop-types';
import Navbar from '../../components/Navbar/Navbar';
import { Button, ButtonGroup, Container, InputLabel, Grid, Select, TextField, Typography } from '@material-ui/core';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { API_BASE_URL } from '../../configs';
const VideoUpload = props => {

    const videoRestrictions = [
        {
            value: 'public',
            label: 'Công khai',
        },
        {
            value: 'friends',
            label: 'Bạn bè',
        },
        {
            value: 'private',
            label: 'Riêng tư',
        }
    ];

    const handleFileInput = async (e) => {
        const video = e.target.files[0];
        
        const formData = new FormData();
        formData.append('video', video);
        
        try {
            const response = await fetch(`${API_BASE_URL}/videos/upload`, {
                method: 'POST',
                body: formData
            });
            console.log(response);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div>
            <Navbar/>
            <div style={{display: 'flex', justifyContent: 'center', marginTop: "50px"}}>
                <Grid container spacing={2} style={{width:"80%", borderRadius: "20px", border:"1px dotted green", backgroundColor: "#ffffff"}}>
                    <Grid item xs={12} style={{border: "2px dotted yellow"}}>
                        <Typography variant='h4'>Tải video lên</Typography> 
                        <p style={{fontSize: "24px"}}>Đăng video vào tài khoản của bạn</p>
                    </Grid>
                    <Grid item xs={3} style={{flexGrow: 1}}>
                        <div className="upload" style={{border: '1px dotted red', textAlign: 'center'}}>
                            <div style={{textAlign: "center"}}>
                                <CloudUploadIcon fontSize="large"/>
                            </div>
                            
                            <Typography variant='h6'>Chọn video để tải lên</Typography> 

                            <p>Hoặc kéo và thả tệp tin</p>
                            <Button 
                                variant='contained' 
                                color='secondary'
                                component='label'
                            >
                                <Typography>Chọn tập tin</Typography> 
                                <input type="file" name="video" onChange={handleFileInput} hidden/>
                            </Button>
                        </div>
                    </Grid>

                    <Grid item xs={1}/>

                    <Grid item xs={7}>
                        <form action="">
                            <TextField 
                                label="Chú thích" 
                                margin="normal"
                                fullWidth
                                variant="standard"
                                InputLabelProps={{
                                    shrink: true,
                                    style: {
                                        fontSize: 20,
                                        fontWeight: "bold",
                                    }
                                }}
                            />

                            <InputLabel htmlFor="restrict-options" style={{marginBottom: "5px", fontWeight: "bold"}}>Ai có thể xem video này</InputLabel>
                            <Select
                                native
                                inputProps={{
                                    name: 'restrict-options',
                                    id: 'restrict-options',
                                }}
                                fullWidth
                                style={{
                                    marginBottom: "50px"
                                }}
                            >
                                {videoRestrictions.map(res => (
                                        <option key={res.value} value={res.value}>
                                            {res.label}
                                        </option>
                                ))}
                            </Select>

                        
                            <div style={{textAlign: 'center'}}>
                                <Button variant="contained" color="default" style={{marginRight: '20px'}}>Hủy</Button>
                                <Button variant="contained" color="secondary">Đăng</Button>
                            </div>

                        </form>
                    </Grid>
                    <Grid item xs={1}/>

                </Grid>
            </div>
        </div>
    );
};



export default VideoUpload;