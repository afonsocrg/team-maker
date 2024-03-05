import Layout from "@pages/Layout";
import Home from "@pages/Home";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from 'react-dnd-html5-backend'
import './styles.css'

export default function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      <Layout navBar={<></>} content={<Home />} />;
    </DndProvider>
  )
}
