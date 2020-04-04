import React from 'react';
import classnames from 'classnames';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import useBaseUrl from '@docusaurus/useBaseUrl';
import styles from './styles.module.css';

const features = [
  {
    title: <>ConfigFirst</>,
    imageUrl: 'img/hamlet_config_first.png',
    description: (
      <>
        hamlet is designed from the ground up to be driven by your CMDB
      </>
    ),
  },
  {
    title: <>Generate and Deploy Infrastructure-as-Code</>,
    imageUrl: 'img/hamlet_tri.png',
    description: (
      <>
        hamlet will generate and execute the files necessary to take your vision into the cloud
      </>
    ),
  },
  {
    title: <>Fly at the speed of the cloud</>,
    imageUrl: 'img/hamlet_recycle.png',
    description: (
      <>
        Keep your infrastructure up to date with the latest technologies, features and cost savings - just run hamlet on your existing CMDB and deploy
      </>
    ),
  },
];

function Feature({imageUrl, title, description}) {
  const imgUrl = useBaseUrl(imageUrl);
  return (
    <div className={classnames('col col--4', styles.feature)}>
      {imgUrl && (
        <div className="text--center">
          <img className={styles.featureImage} src={imgUrl} alt={title} />
        </div>
      )}
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}

function Home() {
  const context = useDocusaurusContext();
  const {siteConfig = {}} = context;
  return (
    <Layout
      title={siteConfig.title}
      description="Description will go into a meta tag in <head />">
      <header className={classnames('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <img src="img/hamlet_title_small.png" sizes="small"/>
          <p className="hero__subtitle">{siteConfig.tagline}</p>
          <div className={styles.buttons}>
            <Link
              className={classnames(
                'button button--secondary  button--lg',
                styles.getStarted,
              )}
              to={useBaseUrl('docs/getting-started/overview')}>
              Get Started
            </Link>
          </div>
        </div>
      </header>
      <main>
        {features && features.length && (
          <section className={styles.features}>
            <div className="container">
              <div className="row">
                {features.map((props, idx) => (
                  <Feature key={idx} {...props} />
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}

export default Home;
