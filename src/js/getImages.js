import axios from "axios";
const API_KEY = '33693100-cf65655f5c3565ff7ce8c6002';
import {Notify} from "notiflix";
const BASE_URL = `https://pixabay.com/api/?key=${API_KEY}`;

export default async function fetchImages(name,page){
   
    const URL = `${BASE_URL}&page=${page}&per_page=12&q=${name}&image_type=photo&orientation=horizontal&safesearch=false`;
    const response = await axios.get(URL);
    //console.log("response" ,response);

    const result = response.data.hits;    
    const amount = response.data.total;
    if(response.data.total!==0){
        await Notify.success("Here your images");
    }else{
        await Notify.failure("Check inputed word")
    }
    return {
        currentAmount:result.length,
        total:amount,
        result
    };
}