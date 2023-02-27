import cls from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useContext, useEffect, useState } from 'react';

import styles from '../../styles/coffee-store.module.css';

import { fetchCoffeeStore, fetchCoffeeStoreDetail } from '../../../lib/coffee-store.jsx';
import { lat, long, query, limit } from '@/constant';

import { isEmpty } from 'utils';
import { StoreContext } from '@/context/storeContext';
import useSWR from 'swr';
import { fetcher } from 'lib/fetcher';

export async function getStaticPaths() {
  const coffeeStore = await fetchCoffeeStore(lat, long, query, 30);
  const pathsFind = coffeeStore.map((item) => ({ params: { id: `${item.fsq_id}` } }));
  return {
    paths: pathsFind ? pathsFind : {},
    fallback: true, // can also be true or 'blocking'
  };
}
export async function getStaticProps(staticProps) {
  const coffeeStore = await fetchCoffeeStore(lat, long, query, 30);
  return {
    props: {
      coffeeStore,
    },
  };
}

const coffeeStore = (initialProps) => {
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStore);
  const { name, imgUrl, location, categories, stats } = coffeeStore;
  const route = useRouter();
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);

  const id = route.query.id;

  const handleCreateCoffeeStore = async (coffeeStore) => {
    try {
      const { fsq_id, name, imgUrl, location, categories, stats } = coffeeStore;
      const data = {
        id: fsq_id,
        total_ratings: stats?.total_ratings ?? 0,
        name,
        address: location?.formatted_address ?? '',
        categories: categories[0]?.name ?? '',
        imgUrl: imgUrl ?? 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80',
      };
      const option = {
        method: 'POST',
        header: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const response = await fetch('../api/createCoffeeSore', option);
      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.log('Error creating coffee store', err);
    }
  };

  useEffect(() => {
    if (isEmpty(initialProps.coffeeStore)) {
      if (coffeeStore.length > 0) {
        const coffeeStoreFromContext = coffeeStore.find((item) => item.fsq_id === id);
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.coffeeStore);
    }
  }, [id, initialProps, initialProps.coffeeStore]);

  const [voting, setVoting] = useState(stats?.total_ratings ?? 0);

  const { data, error } = useSWR(`../api/getCoffeeStoreById?id=${id}`, fetcher, { refreshInterval: 1000 });

  useEffect(() => {
    if (data && data.length > 0) {
      setCoffeeStore(data[0]);
      setVoting(data[0].total_ratings);
    }
  }, [data]);

  if (route.isFallback) {
    return <div>Loading...</div>;
  }

  const handleUpvoteButton = async () => {
    try {
      const data = {
        id,
      };
      const option = {
        method: 'PUT',
        header: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      };
      const response = await fetch('../api/favoriteCoffeeStoreById', option);
      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        const vote = voting + 1;
        setVoting(vote);
      }
    } catch (err) {
      console.log('Error updating coffee store', err);
    }
  };

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name='description' content={`${name} coffee store`} />
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href='/'>← Back to home</Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={imgUrl || 'https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80'}
            width={600}
            height={200}
            className={styles.storeImg}
            alt={'name'}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          {(location?.formatted_address ?? coffeeStore.address) && (
            <div className={styles.iconWrapper}>
              <Image src='/static/icons/places.svg' width='24' height='24' alt='places icon' />
              <p className={styles.text}>{location?.formatted_address ?? coffeeStore.address}</p>
            </div>
          )}
          {location?.neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image src='/static/icons/nearMe.svg' width='24' height='24' alt='near me icon' />
              <p className={styles.text}>{location.neighbourhood[0]}</p>
            </div>
          )}
          {categories && (
            <div className={styles.iconWrapper}>
              <Image src={'/static/icons/nearMe.svg'} width='24' height='24' alt='star icon' />
              <p className={styles.text}>{categories[0]?.name ?? categories}</p>
            </div>
          )}

          <div className={styles.iconWrapper}>
            <Image src={'/static/icons/star.svg'} width='24' height='24' alt='star icon' />
            <p className={styles.text}>{voting}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default coffeeStore;
