import React, { useEffect, useContext } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import Banner from '@/componant/banner';
import Card from '@/componant/card';

import { fetchCoffeeStore } from '../../lib/coffee-store.jsx';

import useTrackLocation from '@/hooks/use-track-location';
import { lat, limit, long, query } from '@/constant';
import { ACTION_TYPE, StoreContext } from '@/context/storeContext';

export async function getStaticProps(context) {
  const coffeeStore = await fetchCoffeeStore(lat, long, query, limit);

  return {
    props: {
      coffeeStore,
    },
  };
}

export default function Home(props) {
  const { errorMessage, handleTrackLocation, isFindingLocation } = useTrackLocation();
  const { state, dispatch } = useContext(StoreContext);
  const { coffeeStore, lat, long } = state;
  useEffect(() => {
    if (lat && long) {
      fetch(`./api/getCoffeeStoreByLocation?lat=${lat}&long=${long}&query=${query}&limit=${30}`).then(async (res) => {
        const coffeeStore = await res.json();
        dispatch({ type: ACTION_TYPE.SET_COFFEE_STORE, payload: { coffeeStore } });
      });
    }
  }, [lat, long]);

  const handleButtonClick = () => {
    handleTrackLocation();
  };
  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <link rel='icon' href='/favicon.ico' />
        <meta name='description' content='allows you to discover coffee stores' />
      </Head>

      <main className={styles.main}>
        <Banner buttonText={isFindingLocation ? 'locating...' : 'view Stor Near By Me'} handleOnClick={handleButtonClick} />
        <div className={styles.heroImage}>
          <Image width={700} height={400} src='/static/hero-image.png' alt='hero' />
        </div>
        {coffeeStore.length > 0 && (
          <>
            <h2 className={styles.heading2}>Near By Me</h2>
            <div className={styles.cardLayout}>
              {coffeeStore.map((item) => (
                <Card
                  key={item.fsq_id}
                  className={styles.card}
                  name={item.name}
                  imgUrl={
                    item.imgUrl ?? 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                  }
                  href={`/coffee-store/${item.fsq_id}`}
                />
              ))}
            </div>
          </>
        )}
        {props.coffeeStore.length > 0 && (
          <>
            <h2 className={styles.heading2}>Toronto Store</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStore.map((item) => (
                <Card
                  key={item.fsq_id}
                  className={styles.card}
                  name={item.name}
                  imgUrl={
                    item.imgUrl ?? 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'
                  }
                  href={`/coffee-store/${item.fsq_id}`}
                />
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
