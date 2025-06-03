const Page = () => {
  return <div />;
};

export default Page;

export const getServerSideProps = () => {
  return {
    redirect: {
      destination: "/foryou",
      permanent: true,
    },
  };
};
