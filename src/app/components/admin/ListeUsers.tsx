import React, { useEffect, useMemo, useState } from 'react';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  TableContainer,
  Link,
  Badge,
} from '@chakra-ui/react';
import { TriangleDownIcon, TriangleUpIcon } from '@chakra-ui/icons';
import {
  useReactTable,
  ColumnDef,
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  flexRender,
} from '@tanstack/react-table';
import api from '@/app/lib/api';
import useColorModeStyles from '@/app/utils/useColorModeStyles';
import s from '@/app/styles/style.module.css';

interface User {
  id: number;
  username: string;
  email: string;
  is_active: boolean;
  is_staff: boolean;
  payement_status: string;
  zones: string;
}

const ListeUsers: React.FC = () => {
  const [data, setData] = useState<User[]>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get<User[]>('/auth/users');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const columns = useMemo<ColumnDef<User>[]>(
    () => [
      {
        accessorKey: 'username',
        header: 'Username',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'email',
        header: 'Email',
        cell: (info) => info.getValue(),
      },
      {
        accessorKey: 'is_active',
        header: 'Status',
        cell: (info) =>
          info.getValue() ? (
            <Badge colorScheme="green">Active</Badge>
          ) : (
            <Badge colorScheme="red">Inactive</Badge>
          ),
      },
      {
        accessorKey: 'is_staff',
        header: 'Role',
        cell: (info) =>
          info.getValue() ? (
            <Badge colorScheme="purple">Admin</Badge>
          ) : (
            <Badge colorScheme="blue">User</Badge>
          ),
      },
      {
        accessorKey: 'username',
        header: 'Graphiques',
        cell: (info) => (
          <Link
            href={`/admin/graph-per-user/${info.getValue()}`}
            _hover={{ textDecoration: 'none' }}
          >
            {/* <Button size="sm" colorScheme="blue">
              Voire
            </Button> */}
            <Badge colorScheme="blue">Voire</Badge>
          </Link>
        ),
      },
      {
        accessorKey: 'username',
        header: 'Donnée du sol',
        cell: (info) => (
          <Link
            href={`/admin/users/data/soil/${info.getValue()}`}
            _hover={{ textDecoration: 'none' }}
          >
            {/* <Button size="sm" colorScheme="blue">
              Voire
            </Button> */}
            <Badge colorScheme="blue">Voire</Badge>
          </Link>
        ),
      },
      {
        accessorKey: 'username',
        header: 'Donnée du station',
        cell: (info) => (
          <Link
            href={`/admin/users/data/station/${info.getValue()}`}
            _hover={{ textDecoration: 'none' }}
          >
            {/* <Button size="sm" colorScheme="blue">
              Voire
            </Button> */}
            <Badge colorScheme="blue">Voire</Badge>
          </Link>
        ),
      },
      {
        accessorKey: 'username',
        header: 'Zones',
        cell: (info) => (
          <Link
            href={`/admin/zone-per-user/${info.getValue()}`}
            _hover={{ textDecoration: 'none' }}
          >
            {/* <Button size="sm" colorScheme="blue">
              Modify
            </Button> */}
            <Badge colorScheme="blue">Voire</Badge>
          </Link>
        ),
      },
      {
        id: 'actions',
        accessorKey: 'username',
        header: 'Action',
        cell: (info) => (
          <Link
            href={`/admin/users/modify/${info.getValue()}`}
            _hover={{ textDecoration: 'none' }}
          >
            {/* <Button size="sm" colorScheme="blue">
              Modifier
            </Button> */}
            <Badge colorScheme="blue">Modifer</Badge>
          </Link>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
  });
  const { bg, textColor, bgColor, thBg, borderColor } = useColorModeStyles(); // Use the utility

  return (
    <div className={s.container}>
      <Box
        className={s.header}
        bg={bg}
        p={4}
        mb={4}
        borderRadius="md"
        boxShadow="sm"
        border="solid 1px"
      >
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Liste des utilisateurs
        </Text>
      </Box>

      <Box className={s.wide}>
        <TableContainer
          bg={bgColor}
          borderRadius="lg"
          boxShadow="base"
          overflowX="auto"
        >
          {loading ? (
            <Box textAlign="center" py={10}>
              <Spinner size="lg" />
            </Box>
          ) : (
            <Table variant="simple">
              <Thead bg={thBg}>
                {table.getHeaderGroups().map((headerGroup) => (
                  <Tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      const isSorted = header.column.getIsSorted();
                      return (
                        <Th
                          key={header.id}
                          onClick={header.column.getToggleSortingHandler()}
                          cursor="pointer"
                          color={textColor}
                          borderColor={borderColor}
                        >
                          <Box display="flex" alignItems="center">
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                            {isSorted === 'asc' && (
                              <TriangleUpIcon ml={1} boxSize={3} />
                            )}
                            {isSorted === 'desc' && (
                              <TriangleDownIcon ml={1} boxSize={3} />
                            )}
                          </Box>
                        </Th>
                      );
                    })}
                  </Tr>
                ))}
              </Thead>
              <Tbody>
                {table.getRowModel().rows.map((row) => (
                  <Tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <Td key={cell.id} color={textColor}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </Td>
                    ))}
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </TableContainer>
      </Box>
    </div>
  );
};

export default ListeUsers;
