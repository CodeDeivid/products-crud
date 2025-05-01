import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Heading,
  useToast,
  Image,
  Badge,
  Tag,
  TagLabel,
  Wrap,
  WrapItem,
  Text,
  SimpleGrid,
  Flex,
  Card,
  CardBody,
  CardFooter,
  Stack,
  IconButton,
  Divider,
  Input,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon, SearchIcon } from '@chakra-ui/icons';
import { useStore } from '../store/useStore';
import { productService } from '../services/api';

export const ProductList = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { products, setProducts, deleteProduct } = useStore();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await productService.getAll();
      setProducts(data);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load products',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await productService.delete(id);
      deleteProduct(id);
      toast({
        title: 'Success',
        description: 'Product deleted successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete product',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  if (products.length === 0) {
    return (
      <Box textAlign="center" py={10} px={6}>
        <Heading size="lg" mb={4}>No products found</Heading>
        <Text mb={6}>You haven't added any products yet. Start by adding your first product!</Text>
        <Button colorScheme="blue" onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      </Box>
    );
  }

  if (filteredProducts.length === 0 && searchTerm) {
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
          <Heading size="lg">Products</Heading>
          <Button colorScheme="blue" onClick={() => navigate('/products/new')}>
            Add Product
          </Button>
        </Box>

        <InputGroup mb={6}>
          <InputLeftElement pointerEvents="none">
            <SearchIcon color="gray.300" />
          </InputLeftElement>
          <Input
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>

        <Box textAlign="center" py={10}>
          <Text>No products found matching "{searchTerm}"</Text>
          <Button mt={4} onClick={() => setSearchTerm('')} variant="outline">
            Clear search
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={6}>
        <Heading size="lg">Products</Heading>
        <Button colorScheme="blue" onClick={() => navigate('/products/new')}>
          Add Product
        </Button>
      </Box>

      <InputGroup mb={6}>
        <InputLeftElement pointerEvents="none">
          <SearchIcon color="gray.300" />
        </InputLeftElement>
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </InputGroup>

      <SimpleGrid
        spacing={6}
        templateColumns={{
          base: '1fr',
          sm: 'repeat(2, 1fr)',
          md: 'repeat(3, 1fr)',
          lg: 'repeat(4, 1fr)',
        }}
      >
        {filteredProducts.map((product) => (
          <Card key={product.id} overflow="hidden">
            <CardBody p={0}>
              <Image
                src={product.photo}
                alt={product.name}
                borderRadius="lg"
                height="200px"
                width="100%"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/300x200"
              />
              <Box p={4}>
                <Stack spacing={3}>
                  <Heading size="md">{product.name}</Heading>
                  <Text color="blue.600" fontSize="2xl">
                    R${product.price.toFixed(2)}
                  </Text>
                  <Flex justify="space-between" align="center">
                    <Text fontWeight="semibold">Quantity:</Text>
                    <Badge colorScheme={product.qty > 0 ? 'green' : 'red'} fontSize="sm" p={1}>
                      {product.qty}
                    </Badge>
                  </Flex>
                  <Box>
                    <Text fontWeight="semibold" mb={1}>Categories:</Text>
                    <Wrap spacing={2}>
                      {product.categories && product.categories.length > 0 ? (
                        product.categories.map(category => (
                          <WrapItem key={category.id}>
                            <Tag size="sm" colorScheme="blue" borderRadius="full">
                              <TagLabel>{category.name}</TagLabel>
                            </Tag>
                          </WrapItem>
                        ))
                      ) : (
                        <Badge colorScheme="gray">Uncategorized</Badge>
                      )}
                    </Wrap>
                  </Box>
                </Stack>
              </Box>
            </CardBody>
            <Divider />
            <CardFooter>
              <Flex w="100%" justifyContent="space-between">
                <IconButton
                  aria-label="Edit product"
                  icon={<EditIcon />}
                  onClick={() => navigate(`/products/${product.id}`)}
                />
                <IconButton
                  aria-label="Delete product"
                  icon={<DeleteIcon />}
                  colorScheme="red"
                  onClick={() => handleDelete(product.id)}
                />
              </Flex>
            </CardFooter>
          </Card>
        ))}
      </SimpleGrid>
    </Box>
  );
};
