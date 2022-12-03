import { motion } from "framer-motion";
import { getSession } from "next-auth/react";
import Head from "next/head";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

import Feed from "../components/Feed";
import Header from "../components/Header";
import { firestore } from "../firebase/firebase";

type Props = {
  session: any;
};

const Home = ({ session }: Props) => {
  const [userCreates, setUserCreate] = useState<boolean>(false);

  const getUserData = async () => {
    if (session) {
      try {
        const docRef = doc(firestore, "users", session?.user?.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          console.log("User Already Created");
          setUserCreate(false);
        } else {
          setUserCreate(true);
        }
      } catch (error) {
        console.log(error);
      }
    } else return;
  };

  const userCreate = async (session: any) => {
    const userDocRef = doc(firestore, "users", session?.user?.uid);
    await setDoc(userDocRef, JSON.parse(JSON.stringify(session)));
  };

  useEffect(() => {
    getUserData();

    if (userCreates) {
      userCreate(session);
    } else return;
  }, [session, firestore, userCreates]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
    >
      <Head>
        <title>Instagram Clone</title>
        <meta name="description" content="Generated by create next app" />
        <link
          rel="icon"
          href="https://i.postimg.cc/wjt4vkWx/pngwing-com-1.png"
        />
      </Head>
      <Header />
      <Feed session={session} />
    </motion.div>
  );
};

export default Home;

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  return {
    props: {
      session: session,
    },
  };
}
