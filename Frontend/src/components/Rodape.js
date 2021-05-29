import React from 'react'
import Navbar from 'react-bootstrap/Navbar'

import { MdCollectionsBookmark } from 'react-icons/md'

const Rodape = () => {
    return (
<Navbar bg="dark" >
    <Navbar.Brand href="#inicio" className="text-light">
        <MdCollectionsBookmark/> Developed by: Davi L. Carasilo and Pedro Spinardi -- 2021 A Fatec’s project
    </Navbar.Brand>
</Navbar>
    )
}

export default Rodape