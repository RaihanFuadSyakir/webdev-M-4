// components/CategorySelect.js
"use client"
import { BACKEND_URL } from '@/constants';
import { useEffect, useState } from 'react';
import { Category, dbResponse } from '@/utils/type';
import { useRouter } from 'next/navigation';
import Autocomplete, { createFilterOptions } from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { Chip, CircularProgress, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import React from 'react';
import axiosInstance from '@/utils/fetchData';
import { AxiosError, AxiosResponse } from "axios";
interface props {
  setSelectedCategory: React.Dispatch<React.SetStateAction<number>>;
  setNewCategories?: React.Dispatch<React.SetStateAction<Category[]>>
}
interface data {
  id?: number,
  name?: string,
  newValue?: string
}

const filter = createFilterOptions<data>();
const CategorySelect: React.FC<props> = ({ setSelectedCategory, setNewCategories }) => {
  const router = useRouter()
  const [categories, setCategories] = useState<data[]>([]);
  const [currentCategory, setCurrentCategory] = useState<data | null>(null);
  const [open, setOpen] = useState(false);
  const loading = open && categories.length === 0;

  const handleCreate = (selectedOption: data) => {
    createCategory(selectedOption.newValue!);
  }
  const handleDelete = (selectedOption: number) => {
    deleteCategory(selectedOption);
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
        axiosInstance.get(`/categories/user`)
          .then((response: AxiosResponse) => {
            const res: dbResponse<Category[]> = response.data;
            const categoryList: Category[] = res.data;
            categoryList.forEach((category) => {
              setCategories((prev) => {
                return [...prev, { id: category.id, name: category.category_name }]
              })
            })
          }).catch((res_err: AxiosError<dbResponse<Category>>) => {
            console.log(JSON.stringify(res_err.response?.data))
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
  function createCategory(name: string) {
    axiosInstance.post(`/categories`, {
      category_name: name
    })
      .then((response: AxiosResponse<dbResponse<Category>>) => {
        const data = response.data.data;
        setSelectedCategory(data.id);
        //console.log("create success");
        if (setNewCategories !== undefined) {
          setNewCategories((prev) => [...prev, data]);
        }
      })
      .catch((res_err: AxiosError<dbResponse<Category>>) => {
        console.log(JSON.stringify(res_err.response?.data));
      })
  }
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
            handleCreate(newValue);
          } else {
            setCurrentCategory(newValue)
            setSelectedCategory(newValue?.id!)
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
              newValue: inputValue,
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
                <div>{option.name}</div>
                <div>
                  <IconButton aria-label="delete" className='m-2' onClick={() => handleDelete(option.id!)}>
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </div>
              </div>
            </li>
          );
        }}
      />
    </div>
  );
};


function sleep(duration: number): Promise<void> {
  return new Promise<void>((resolve) => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}

function deleteCategory(id: number) {
  axiosInstance.delete(`/categories/${id}`)
    .then(() => {
      //console.log("delete success");
    })
    .catch((res_err: AxiosError<dbResponse<Category>>) => {
      console.log(JSON.stringify(res_err.response?.data));
    })
}
export default CategorySelect;
