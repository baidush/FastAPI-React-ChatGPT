import React from "react";
import { render } from 'react-dom';
import { ChakraProvider } from '@chakra-ui/react';
// const { ChakraProvider, toast } = createStandaloneToast()////

import Header from "./Components/Header";
import Notes from "./Components/Notes";

function App() {
  return (
    <ChakraProvider>
      <Header />
      <Notes />
    </ChakraProvider>
  )
}

const rootElement = document.getElementById("root")
render(<App />, rootElement)
