
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

interface SearchItem {
  id: string | number;
  name: string;
  type: string;
  url: string;
}

interface SearchDialogProps {
  searchableItems: SearchItem[];
}

const SearchDialog = ({ searchableItems }: SearchDialogProps) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    navigate(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`);
  };

  const handleSearchItemClick = (url: string) => {
    setIsSearchOpen(false);
    navigate(url);
  };

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        aria-label="Search" 
        onClick={() => setIsSearchOpen(true)}
      >
        <Search className="h-5 w-5" />
      </Button>
      <CommandDialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <form onSubmit={handleSearch}>
          <CommandInput 
            placeholder="Tìm kiếm khóa học, sản phẩm, bài viết..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
        </form>
        <CommandList>
          <CommandEmpty>Không tìm thấy kết quả</CommandEmpty>
          <CommandGroup heading="Kết quả tìm kiếm">
            {searchableItems
              .filter(item => 
                item.name.toLowerCase().includes(searchQuery.toLowerCase())
              )
              .slice(0, 5)
              .map(item => (
                <CommandItem 
                  key={`${item.type}-${item.id}`}
                  onSelect={() => handleSearchItemClick(item.url)}
                >
                  <span className="mr-2 text-sm text-gray-500">{item.type}</span>
                  <span>{item.name}</span>
                </CommandItem>
              ))
            }
          </CommandGroup>
          <CommandGroup>
            <CommandItem onSelect={() => handleSearchItemClick(`/tim-kiem?q=${encodeURIComponent(searchQuery)}`)}>
              <Search className="mr-2 h-4 w-4" />
              <span>Xem tất cả kết quả cho "{searchQuery}"</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default SearchDialog;
