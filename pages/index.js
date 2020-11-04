import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';
import Link from 'next/link';
const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint)
  const data = await res.json();

  return {
    props: {
      data
    }
  }
}


export default function Home({data}) {
  const {info, results: defaultResults = []} = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({...info, current: defaultEndpoint});
  const { current } = page;

useEffect(() => {
  if ( current === defaultEndpoint ) return;

  async function request() {
    const res = await fetch(current)
    const nextData = await res.json();

    updatePage({
      current,
      ...nextData.info
    });

    if ( !nextData.info?.prev ) {
      updateResults(nextData.results);
      return;
    }

    updateResults(prev => {
      return [
        ...prev,
        ...nextData.results
      ]
    });
  }

  request();
}, [current]);


function handleLoadMore() {
  updatePage(prev => {
    return {
      ...prev,
      current: page?.next
    }
  
  });
}
  
  function handleOnSubmitSearch(e){
    e.preventDefault();
    const { currentTarget = {} } = e;
    const fields = Array.from(currentTarget?.elements);
    const fieldQuery = fields.find(field => field.name === 'query');
  
    const value = fieldQuery.value || '';
    const endpoint = `https://rickandmortyapi.com/api/character/?name=${value}`;
  
    updatePage({
      current: endpoint
    });

}
  return (
    <div className={styles.container}>
      <Head>
        <title>RICKIPEDIA</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
         RICK AND MORTY WIKI
        </h1>
        <p className={styles.description}>
        WELCOME TO THE RICK AND MORTY WIKI!
        </p>
       
          

<form className={styles.searchBox}  onSubmit = {handleOnSubmitSearch}>

<input className={styles.searchInput} type="search" name="query" placeholder="Search" />
<button className={styles.searchButton}  href="#">
    {/* <i className={styles.search}>
        search
    </i> */}
    <img src="/search.svg" alt="search" className={styles.icon} />
</button>
</form> 

        <ul className={styles.grid}>
        
         {results.map (result => {
            const { id, name, image } = result;
          return(
            <li key= {id} className={styles.card}>
              <Link href="/character/[id]" as={`/character/${id}`}>
              <a >
              <img src ={image} alt ={`${name} Thumbnail`} />
              <h3>{name}</h3>
           </a>
              </Link>
           
            </li> 
          )         
           })}

         </ul>
         <p>
           <button onClick = {handleLoadMore}>Load More </button>
         </p>
           
      </main>

      <footer className={styles.footer}>
          <h3> Developed By : Radhika</h3>
       </footer>
    </div>
 );
}
