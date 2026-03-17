import BaseLayout from "@/components/BaseLayout";
import "@/styles/globals.css";
import type { AppProps } from "next/app";
// import { SessionProvider } from "next-auth/react";
import { Amplify } from "aws-amplify";

// Amplify.configure(
//   {
//     Auth: {
//       Cognito: {
//         userPoolId: "us-east-1_8CIhL070h",
//         userPoolClientId: "2lucfvfs1pb37ekqb3fsq4run6",
//         // If your Cognito setup requires a specific region
//         loginWith: {
//           email: true,
//         },
//       },
//     },
//   },
//   { ssr: true },
// );

export default function App({ Component, pageProps }: AppProps) {
  return (
    <BaseLayout>
      <Component {...pageProps} />
    </BaseLayout>
  );
}
