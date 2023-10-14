// components/CategorySelect.js
"use client"
import { BACKEND_URL } from '@/constants';
import { useEffect, useState } from 'react';
import { Category, dbResponse } from '@/utils/type';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import Autocomplete,{ createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip, CircularProgress } from '@mui/material';
import React from 'react';
interface props {
    setSelectedCategory: React.Dispatch<React.SetStateAction<number>>;
  }
interface data {
    id? : number,
    name? : string,
    newValue?:string
}
function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
const filter = createFilterOptions<data>();
const CategorySelect :  React.FC<props> =({setSelectedCategory}) => {
    const router = useRouter()
    const [categories, setCategories] = useState<data[]>([]);
    const [currentCategory,setCurrentCategory] = useState<data|null>(null);
    const [open, setOpen] = useState(false);
    const loading = open && categories.length === 0;

    const handleCreate = (selectedOption : data) =>{

    }
    const handleUpdate = (selectedOption : data) =>{

    }
    const handleDelete = (selectedOption : data) =>{
        const updatedCategories = categories.filter((category) => category.id !== selectedOption.id);
        setCategories(updatedCategories);
    }
    useEffect(() => {
      let active = true;

      if (!loading) {
        return undefined;
      }
        // Make a GET request to your backend API endpoint to fetch categories.
        (async () => {
          await sleep(1e3); // For demo purposes.
    
          if (active) {
            axios.get(`${BACKEND_URL}/api/categories/user`, {
              headers: {
                  'Content-Type': 'application/json',
              },
              withCredentials: true,
          }).then((response: AxiosResponse) => {
              const res: dbResponse<Category[]> = response.data;
              const categoryList: Category[] = res.data;
              categoryList.forEach((category) =>{
                  setCategories((prev) =>{
                      return [...prev,{id:category.id ,name : category.category_name}]
                  })
              })
          }).catch((e) => { 
              router.push('login');
          })
          }
        })();
    
        return () => {
          active = false;
        };
        
    }, [loading]);
    useEffect(() => {
      if (!open) {
        setCategories([]);
      }
    }, [open]);
    return (
        <div className='flex'>
            <Autocomplete
                id="choose-category"
                open={open}
                onOpen={() => {
                  setOpen(true);
                }}
                onClose={() => {
                  setOpen(false);
                }}
                loading={loading}
                value={currentCategory}
                onChange={(event, newValue) => {
                    if (typeof newValue === 'string') {
                      setCurrentCategory({
                        name: newValue,
                      });
                    } else if (newValue && newValue.newValue) {
                      // Create a new value from the user input
                      console.log(`add category ${newValue.newValue}`);
                      setCategories((prev)=>[...prev,{id:500,name:newValue.newValue}])
                    } else {
                      setCurrentCategory(newValue)
                    }
                  }}
                selectOnFocus
                clearOnBlur
                handleHomeEndKeys
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
            
                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.name);
                    if (inputValue !== '' && !isExisting) {
                      filtered.push({
                        newValue : inputValue,
                        name: `Add "${inputValue}"`,
                      });
                    }
                    return filtered;
                }}
                options={categories}
                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === 'string') {
                      return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.newValue) {
                      return option.newValue!;
                    }
                    // Regular option
                    return option.name!;
                  }}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField
                  {...params}
                  label="Category"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </React.Fragment>
                    ),
                  }}
                />}
                renderOption={(props, option) => {
                    return (
                        <li {...props} key={option.id}>
                            <div className='flex justify-between align-middle'>
                                <span>{option.name}</span>
                            </div>
                        </li>
                    );
                }}
            />
        </div>
    );
};

export default CategorySelect;
