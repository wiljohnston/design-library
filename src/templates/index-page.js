/* eslint-disable react/prop-types */
// import { PropTypes } from "prop-types";

import React from "react";
import { graphql } from "gatsby";
import Footer from "~components/Footer";
import Layout from "~components/Layout";
import SEO from "~components/SEO";
import DataFall from "~components/DataFall";

const IndexPage = ({ data, location }) => {
  const { frontmatter } = data.markdownRemark;

  return (
    <>
      <SEO
        customTitle={frontmatter.title}
        customDescription={frontmatter.seoDescription}
        customKeywords={frontmatter.seoKeywords}
        path={location.pathname}
      />

      <Layout className="index-page relative">
        <section className="w-full h-screen flex items-center justify-center">
          <div className="w-48 h-48 absolute">
            <DataFall />
          </div>
        </section>
      </Layout>

      <Footer />
    </>
  );
};

export default IndexPage;

export const query = graphql`
  query IndexPage($id: String!) {
    markdownRemark(id: { eq: $id }) {
      frontmatter {
        title
        seoDescription
        seoKeywords
      }
    }
  }
`;
