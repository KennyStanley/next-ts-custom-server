import Head from 'next/head'

import Header, { HeaderTypes } from '../components/Header'
import Cards from '../components/Cards'
import Footer from '../components/Footer'

export default function Home() {
    const headerData: HeaderTypes = {
        title: 'Hello there!',
        subtitle: 'Get started by editing',
        path: 'src/pages/index.tsx',
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
            <Head>
                <title>next + ts + twcss</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>

            <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
                <Header {...headerData} />
                <section className="flex flex-wrap items-center justify-around max-w-4xl mt-6 sm:w-full">
                    <Cards />
                </section>
            </main>

            <Footer />
        </div>
    )
}
