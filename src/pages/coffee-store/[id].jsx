import cls from 'classnames';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React from 'react';

import styles from '../../styles/coffee-store.module.css';

import { fetchCoffeeStoreDetail } from '../../../lib/coffee-store.jsx';

export async function getStaticPaths() {
  const paths = [];

  return {
    paths,
    fallback: true, // can also be true or 'blocking'
  };
}

export async function getStaticProps(staticProps) {
  const param = staticProps.params;
  const coffeeStore = await fetchCoffeeStoreDetail(param.id, '?fields=categories%2Cstats%2Cname%2Clocation');

  return {
    props: {
      coffeeStore,
    },
  };
}

const coffeeStore = (props) => {
  const route = useRouter();
  console.log(props);
  if (route.isFallback) {
    return <div>Loading...</div>;
  }
  const { name, imgUrl, location, categories, stats } = props.coffeeStore;

  const handleUpvoteButton = () => {};

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
            alt={name}
          />
        </div>

        <div className={cls('glass', styles.col2)}>
          {location.formatted_address && (
            <div className={styles.iconWrapper}>
              <Image src='/static/icons/places.svg' width='24' height='24' alt='places icon' />
              <p className={styles.text}>{location.formatted_address}</p>
            </div>
          )}
          {location.neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image src='/static/icons/nearMe.svg' width='24' height='24' alt='near me icon' />
              <p className={styles.text}>{location.neighbourhood[0]}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image src={'/static/icons/nearMe.svg'} width='24' height='24' alt='star icon' />
            <p className={styles.text}>{categories[0].name}</p>
          </div>
          <div className={styles.iconWrapper}>
            <Image src={'/static/icons/star.svg'} width='24' height='24' alt='star icon' />
            <p className={styles.text}>{stats.total_ratings}</p>
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
