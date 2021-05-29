import React from 'react'

import Navbar from 'react-bootstrap/Navbar'
import Nav from 'react-bootstrap/Nav'
import Dropdown from 'react-bootstrap/Dropdown'
import DropdownButton from 'react-bootstrap/DropdownButton'
import ButtonGroup from 'react-bootstrap/ButtonGroup'


import {
   MdDescription, MdHome,
  MdMailOutline, MdCollectionsBookmark
} from 'react-icons/md'

const Cabecalho = () => {
  return (
    <Navbar className="cabecalho">
      <Navbar.Brand href="#home"><MdCollectionsBookmark /></Navbar.Brand>
      <Nav className="mr-auto">
        <Nav.Link href="#/home" className="active"><MdHome /> Home</Nav.Link>
      </Nav>
    </Navbar>
  )
}

export default Cabecalho