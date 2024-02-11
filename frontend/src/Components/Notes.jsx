import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Flex,
    Input,
    InputGroup,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useDisclosure
} from "@chakra-ui/react";

const NotesContext = React.createContext({
  notes: [], fetchNotes: () => {}
})

function AddNote() {
  const [item, setItem] = React.useState("")
  const {notes, fetchNotes} = React.useContext(NotesContext)

  const handleInput = event  => {
    setItem(event.target.value)
  }

  const handleSubmit = (event) => {
    const newNote = {
      "id": notes.length + 1,
      "item": item
    }

    fetch("http://localhost:8000/todo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote)
    }).then(fetchNotes)
  }

  return (
    <form onSubmit={handleSubmit}>
      <InputGroup size="md">
        <Input
          pr="4.5rem"
          type="text"
          placeholder="Add a note item"
          aria-label="Add a note item"
          onChange={handleInput}
        />
      </InputGroup>
    </form>
  )
}

function UpdateNote({item, id}) {
  const {isOpen, onOpen, onClose} = useDisclosure()
  const [note, setNote] = useState(item)
  const {fetchNotes} = React.useContext(NotesContext)

  const updateNote = async () => {
    await fetch(`http://localhost:8000/todo/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ item: note })
    })
    onClose()
    await fetchNotes()
  }

  return (
    <>
      <Button h="1.5rem" size="sm" onClick={onOpen}>Update Note</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay/>
        <ModalContent>
          <ModalHeader>Update Note</ModalHeader>
          <ModalCloseButton/>
          <ModalBody>
            <InputGroup size="md">
              <Input
                pr="4.5rem"
                type="text"
                placeholder="Add a note item"
                aria-label="Add a note item"
                value={note}
                onChange={e => setNote(e.target.value)}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button h="1.5rem" size="sm" onClick={updateNote}>Update Note</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

function DeleteNote({id}) {
  const {fetchNotes} = React.useContext(NotesContext)

  const deleteNote = async () => {
    await fetch(`http://localhost:8000/todo/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: { "id": id }
    })
    await fetchNotes()
  }

  return (
    <Button h="1.5rem" size="sm" onClick={deleteNote}>Delete Note</Button>
  )
}

function NoteHelper({item, id, fetchNotes}) {
  return (
    <Box p={1} shadow="sm">
      <Flex justify="space-between">
        <Text mt={4} as="div">
          {item}
          <Flex align="end">
            <UpdateNote item={item} id={id} fetchNotes={fetchNotes}/>
            <DeleteNote id={id} fetchNotes={fetchNotes}/>
          </Flex>
        </Text>
      </Flex>
    </Box>
  )
}

export default function Notes() {
  const [notes, setNotes] = useState([])
  const fetchNotes = async () => {
    const response = await fetch("http://localhost:8000/todo")
    const notes = await response.json()
    setNotes(notes.data)
  }
  useEffect(() => {
    fetchNotes()
  }, [])
  return (
    <NotesContext.Provider value={{notes, fetchNotes}}>
      <AddNote />
      <Stack spacing={5}>
        {
          notes.map((note) => (
            <NoteHelper item={note.item} id={note.id} fetchNotes={fetchNotes} />
          ))
        }
      </Stack>
    </NotesContext.Provider>
  )
}
