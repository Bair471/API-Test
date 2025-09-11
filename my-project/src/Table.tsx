import { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableHead from '@mui/material/TableHead';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Button from '@mui/material/Button';
import PersonModal from "./modal";

export interface Person {
  id: number;
  name: string;
  age: number;
}

export function PersonTable() {
    const [persons, setPersons] = useState<Person[]>([]);
    const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
         
    useEffect(() => {
        fetch("http://localhost:8000/persons")
        .then((res) => res.json())
        .then((data) => setPersons(data))
        .catch((err) => console.error('Ошибка', err));
    }, []);

    const onDelete = async (id: number) => {
      await fetch(`http://localhost:8000/persons/${id}`, {
        method: 'DELETE',
      });
      setPersons((prev) => prev.filter((person) => person.id !== id));
    };

    const handleEdit = (person: Person) => {
      setSelectedPerson(person);
    };

    const handleCloseModal = () => {
      setSelectedPerson(null);

      fetch("http://localhost:8000/persons")
      .then((res) => res.json())
      .then((data) => setPersons(data))
      .catch((err) => console.error('Ошибка', err));
    };

    return (
      <>
       <Table sx={{ maxWidth: 600, margin: 'auto', mb: 4 }}>
       <TableHead>
                <TableRow>
                    <TableCell>ID</TableCell>
                    <TableCell>Имя</TableCell>
                    <TableCell>Возраст</TableCell>
                    <TableCell>Действия</TableCell> 
                </TableRow>
         </TableHead>
        <TableBody>
        {persons.map((person) => (
                    <TableRow key={person.id}>
                        <TableCell>{person.id}</TableCell>
                        <TableCell>{person.name}</TableCell>
                        <TableCell>{person.age}</TableCell>
                        <TableCell>
                        
                            <Button
                                variant="outlined"
                                color="primary"
                                size="small"
                                onClick={() => handleEdit(person)}
                                sx={{ mr: 1 }}
                            >
                                Редактировать
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => onDelete(person.id)}
                            >
                                Удалить
                            </Button>
                        </TableCell>
                      </TableRow>
                       ))}
        </TableBody>
      </Table>
      
     
      <PersonModal
          person={selectedPerson}
          onSave={handleCloseModal}
          onClose={handleCloseModal}
      />
             
      </>
      );
}