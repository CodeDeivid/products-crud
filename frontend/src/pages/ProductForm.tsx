import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Button,
  Input,
  Heading,
  useToast,
  FormControl as ChakraFormControl,
  FormLabel as ChakraFormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Image,
  Checkbox,
  Stack,
  Text,
  Divider,
} from '@chakra-ui/react';
import { useStore } from '../store/useStore';
import { productService, Product, categoryService, Category } from '../services/api';

export const ProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { addProduct, updateProduct } = useStore();
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
  const [formData, setFormData] = useState<Omit<Product, 'id' | 'categories'>>({
    name: '',
    price: 0,
    qty: 0,
    photo: '',
  });

  useEffect(() => {
    loadCategories();
    if (id) {
      loadProduct();
    }
  }, [id]);

  const loadCategories = async () => {
    try {
      const data = await categoryService.getAll();
      setCategories(data);
    } catch (error) {
      console.error('Failed to load categories:', error);
      toast({
        title: 'Erro',
        description: 'Failed to load categories',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const loadProduct = async () => {
    try {
      const product = await productService.getById(id!);
      setFormData({
        name: product.name,
        price: product.price,
        qty: product.qty,
        photo: product.photo,
      });

      if (product.categories && product.categories.length > 0) {
        setSelectedCategoryIds(product.categories.map(cat => cat.id));
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load product',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      navigate('/');
    }
  };

  const handleCategoryChange = (categoryId: string, isChecked: boolean) => {
    if (isChecked) {
      setSelectedCategoryIds([...selectedCategoryIds, categoryId]);
    } else {
      setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== categoryId));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const productData = {
        ...formData,
        categoryIds: selectedCategoryIds,
      };

      if (id) {
        const updatedProduct = await productService.update(id, productData);
        updateProduct(id, updatedProduct);
        toast({
          title: 'Success',
          description: 'Product updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        const newProduct = await productService.create(productData);
        addProduct(newProduct);
        toast({
          title: 'Success',
          description: 'Product created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Error',
        description: 'Failed to save product',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="container.md" mx="auto">
      <Heading size="lg" mb={6}>
        {id ? 'Edit Product' : 'New Product'}
      </Heading>

      <form onSubmit={handleSubmit}>
        <ChakraFormControl mb={4}>
          <ChakraFormLabel>Name</ChakraFormLabel>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </ChakraFormControl>

        <ChakraFormControl mb={4}>
          <ChakraFormLabel>Price</ChakraFormLabel>
          <NumberInput
            min={0}
            step={0.01}
            value={formData.price}
            onChange={(_, value) => setFormData({ ...formData, price: value })}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </ChakraFormControl>

        <ChakraFormControl mb={4}>
          <ChakraFormLabel>Quantity</ChakraFormLabel>
          <NumberInput
            min={0}
            value={formData.qty}
            onChange={(_, value) => setFormData({ ...formData, qty: value })}
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
        </ChakraFormControl>

        <ChakraFormControl mb={4}>
          <ChakraFormLabel>Photo URL</ChakraFormLabel>
          <Input
            type="url"
            value={formData.photo}
            onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
            required
            placeholder="https://example.com/image.jpg"
          />
        </ChakraFormControl>

        {formData.photo && (
          <Box mb={6}>
            <Image
              src={formData.photo}
              alt={formData.name}
              maxH="200px"
              objectFit="contain"
              fallbackSrc="https://via.placeholder.com/200"
            />
          </Box>
        )}

        <ChakraFormControl mb={4}>
          <ChakraFormLabel>Categories</ChakraFormLabel>
          <Box maxH="220px" overflowY="auto" p={2} borderWidth={1} borderRadius="md">
            <Stack spacing={2}>
              {categories.length === 0 ? (
                <Text color="gray.500">Loading Categories...</Text>
              ) : (
                categories.map((category) => (
                  <Checkbox
                    key={category.id}
                    isChecked={selectedCategoryIds.includes(category.id)}
                    onChange={(e) => handleCategoryChange(category.id, e.target.checked)}
                  >
                    {category.name}
                  </Checkbox>
                ))
              )}
            </Stack>
          </Box>
        </ChakraFormControl>

        <Divider my={6} />

        <Box display="flex" gap={4}>
          <Button type="submit" colorScheme="blue">
            {id ? 'Update' : 'Create'}
          </Button>
          <Button onClick={() => navigate('/')}>Cancel</Button>
        </Box>
      </form>
    </Box>
  );
}; 
