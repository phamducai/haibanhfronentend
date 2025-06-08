
import CourseCard, { CourseCardProps } from './CourseCard';
import { motion } from 'framer-motion';

interface ProductGridProps {
  products: CourseCardProps[];
  title?: string;
  subtitle?: string;
}

const ProductGrid = ({ products, title, subtitle }: ProductGridProps) => {
  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };
  
  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        {title && (
          <h2 className="text-3xl font-bold text-center mb-3">{title}</h2>
        )}
        {subtitle && (
          <p className="text-gray-600 text-center mb-10 max-w-2xl mx-auto">{subtitle}</p>
        )}
        
        {products.length === 0 ? (
          <div className="text-center py-16">
            <h3 className="text-xl text-gray-500">Không tìm thấy sản phẩm nào</h3>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {products.map((product) => (
              <motion.div key={product.id} variants={item} className="hover-scale">
                <CourseCard 
                  id={product.id}
                  title={product.title}
                  description={product.description}
                  image={product.image}
                  price={product.price}
                  regularPrice={product.regularPrice}
                  type={product.type}
                  buttonType={product.buttonType}
                  downloadurl={product.downloadurl}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default ProductGrid;
