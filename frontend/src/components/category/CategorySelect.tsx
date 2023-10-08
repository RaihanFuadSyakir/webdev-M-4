// components/CategorySelect.js
"use client"
import { BACKEND_URL } from '@/constants';
import { useEffect, useState } from 'react';
import { Category, dbResponse } from '@/utils/type';
import axios, { AxiosResponse } from 'axios';
import { useRouter } from 'next/navigation';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip } from '@mui/material';
import ButtonCreateCategory from './ButtonCreateCategory';
import ButtonDeleteCategory from './ButtonDeleteCategory';
interface props {
    setSelectedCategory: React.Dispatch<React.SetStateAction<number>>;
  }

const CategorySelect :  React.FC<props> =({setSelectedCategory}) => {
    const router = useRouter()
    const [categories, setCategories] = useState<{id : number,label : string}[]>([]);
    const [isExist,setExist] = useState(false);
    console.log(isExist)
    const handleCreate = (e : any) =>{

    }
    const handleDelete = (e: any) =>{
        
    }
    useEffect(() => {
        // Make a GET request to your backend API endpoint to fetch categories.
        console.log("fetching")
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
                    return [...prev,{id:category.id ,label : category.category_name}]
                })
            })
        }).catch((e) => { 
            router.push('login');
        })
    }, []);

    return (
        <div className='flex'>
            <Autocomplete
                onChange={(event,value)=>{
                    if(value !== undefined){
                        setSelectedCategory(value!.id);
                        setExist(true);
                    }
                    else{
                        setSelectedCategory(0);
                        setExist(false);
                    } 
                }}
                disablePortal
                id="combo-box-demo"
                options={categories}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Category" name="category"/>}
                renderOption={(props, option) => {
                    return (
                      <li {...props} key={option.id}>
                        {option.label}
                      </li>
                    );
                  }}
                
            />
            <ButtonCreateCategory isExist={isExist} onClick={handleCreate}/>
            <ButtonDeleteCategory isExist={isExist} onClick={handleDelete}/>
        </div>
    );
};

export default CategorySelect;
