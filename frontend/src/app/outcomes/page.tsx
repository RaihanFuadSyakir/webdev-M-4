"use client"

import CategorySelect from "@/components/category/CategorySelect";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { currencySchema } from "@/utils/validation";
import { useState } from "react";
import { ZodError } from "zod";
import Button from "@mui/material/Button";

const Outcomes = () => {
  const [nominal,setNominal] = useState(0);
  const [category,setCategpry] = useState('')
  const [description,setDescription] = useState('')
  const [nominalError,setNominalError] = useState('');
  const handleInput = (e : React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>{
    const {name,value} = e.target;
    if(name === 'nominal'){
      try {
        const nominal = currencySchema.parse(parseInt(value));
        setNominal(nominal);
        setNominalError('')
      } catch (error) {
        if (error instanceof ZodError) {
          setNominalError(error.issues[0].message);
        }
      }
    }
    else if(name === 'category'){
      setCategpry(value);
    }
    else if(name === 'description'){
      setDescription(value);
    }
  }
  const addOutcome = () =>{

  }
  return (
    <div className="h-96 w-96 bg-amber-100 rou">
      <div className="w-full">
        <h2>Outcome</h2>
        <TextField
          error={nominalError !== ''}
          id={nominalError !== '' ? "outlined-required" : "outlined-error-helper-text"}
          label="Nominal"
          name="nominal"
          sx={{ m: 1, width: 'auto' }}
          InputProps={{
            startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
          }}
          helperText={nominalError}
          value={nominal}
          onChange={handleInput}
        />
      </div>
      <div>
        <h2>Category</h2>
        <CategorySelect setSelectedCategory={setCategpry}/>
      </div>
      <div>
        <h2>Deskripsi</h2>
        <textarea name="description" id="deskripsi" rows={6} onChange={handleInput}></textarea>
      </div>
      <Button color="secondary" onClick={addOutcome}>Tambahkan</Button>
    </div>
  );
};

export default Outcomes;