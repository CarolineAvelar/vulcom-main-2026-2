import React from 'react'

import Typography from '@mui/material/Typography'


export default function Homepage() {


 const [entries, setEntries] = React.useState([])


 React.useEffect(() => {

   const data = Object.keys(localStorage).map(key => ({

     key,

     value: localStorage.getItem(key)

   }))


   setEntries(data)

 }, [])


 return(

   <>

     <Typography variant="h1" gutterBottom>

       Projeto VULCOM

     </Typography>

   

     <Typography>

       Sistema para análise e estudo de vulnerabilidades comuns

     </Typography>


     <Typography variant="h2" gutterBottom sx={{ mt: 4 }}>

       Entradas do Local Storage

     </Typography>


     {entries.length === 0 ? (

       <Typography>Nenhuma entrada encontrada.</Typography>

     ) : (

       <ul>

         {entries.map(entry => (

           <li key={entry.key}>

             <Typography component="div">

               <strong>Chave:</strong> {entry.key}

             </Typography>


             <Typography

               component="pre"

               sx={{ whiteSpace: 'pre-wrap', overflowWrap: 'anywhere' }}

             >

               {entry.value}

             </Typography>

           </li>

         ))}

       </ul>

     )}


   </>

 )

}