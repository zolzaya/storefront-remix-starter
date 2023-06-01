import {
  SfIconShoppingCart,
  SfIconFavorite,
  SfIconPerson,
  SfIconMenu,
  SfIconChevronRight,
  SfIconClose,
  SfButton,
  SfDrawer,
  SfListItem,
  useDisclosure,
  useTrapFocus,
  SfInput,
  SfIconSearch,
} from '@storefront-ui/react';
import { useRef, useState } from 'react';
import { useClickAway } from 'react-use';
import { CSSTransition } from 'react-transition-group';
import { Link } from '@remix-run/react';
import { RootLoaderData } from '~/root';

const bannerDetails = {
  image: 'https://placeimg.com/700/700/tech',
  title: 'New in designer watches.',
};

export default function Header({
  onCartIconClick,
  cartQuantity,
  collections,
  isSignedIn,
} : {
  onCartIconClick: () => void;
  cartQuantity: number;
  collections: RootLoaderData['collections'];
  isSignedIn: boolean;
}) {
  const { close, toggle, isOpen } = useDisclosure({ initialValue: false });
  const [inputValue, setInputValue] = useState('');
  const drawerRef = useRef(null);
  const menuRef = useRef(null);

  const search = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    alert(`Successfully found 10 results for ${inputValue}`);
  };

  useTrapFocus(drawerRef, { activeState: isOpen, arrowKeysOn: true });
  useClickAway(menuRef, () => {
    close();
  });

  return (
    <div className="w-full h-full">
      {/* <p className="flex h-10 items-center justify-center bg-indigo-600 px-4 text-sm font-medium text-white sm:px-6 lg:px-8">
        Get free delivery on orders over $100
      </p> */}
      {isOpen && (
        <div className="fixed inset-0 bg-neutral-500 bg-opacity-50 transition-opacity" />
      )}
      <header
        ref={menuRef}
        className="flex justify-center w-full border-0 bg-primary-700 border-neutral-200 h-14 md:relative md:h-20 md:z-10"
      >
        <div className="flex items-center flex-nowrap justify-start h-full max-w-[1536px] w-full px-4 md:px-10">
          <Link
            to="/"
            aria-label="SF Homepage"
            className="inline-block text-white mr-2 lg:mr-10"
          >
            <picture>
              <source
                srcSet={'https://docs.storefrontui.io/v2-react/_next/static/media/vsf_logo_white.403187b4.svg'}
                media="(min-width: 767px)"
              />
              <img
                src={'https://docs.storefrontui.io/v2-react/_next/static/media/vsf_logo_white.403187b4.svg'}
                alt="Superb Logo"
                className="w-8 h-8 mr-4 md:w-[12.5rem] md:h-[1.75rem]"
              />
            </picture>
          </Link>
          <nav
            className="flex w-full justify-between flex-nowrap"
            aria-label="SF Navigation"
          >
            <ul>
              <li role="none">
                <SfButton
                  className="block !px-2 mr-auto text-white font-body bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
                  type="button"
                  aria-haspopup="true"
                  aria-expanded={isOpen}
                  slotSuffix={
                    <>
                      <SfIconChevronRight className="hidden rotate-90 md:inline-flex" />
                      <SfIconMenu className="inline-flex md:hidden" />
                    </>
                  }
                  variant="tertiary"
                  onClick={toggle}
                >
                  <span className="hidden md:inline-flex">БҮХ АНГИЛАЛ</span>
                </SfButton>
                <CSSTransition
                  in={isOpen}
                  timeout={500}
                  unmountOnExit
                  classNames={{
                    enter: '-translate-x-full md:opacity-0 md:translate-x-0',
                    enterActive:
                      'translate-x-0 md:opacity-100 transition duration-500 ease-in-out',
                    exitActive:
                      '-translate-x-full md:opacity-0 md:translate-x-0 transition duration-500 ease-in-out',
                  }}
                >
                  <SfDrawer
                    ref={drawerRef}
                    open
                    disableClickAway
                    placement="top"
                    className="grid grid-cols-1 gap-4 md:grid-cols-6 bg-white max-w-xs shadow-lg p-0 !fixed max-h-screen overflow-y-auto md:!absolute md:!top-[5rem] md:max-w-full md:p-8"
                  >
                    <div className="flex items-center justify-between py-2 px-4 bg-primary-700 md:hidden">
                      <div className="flex items-center typography-text-lg font-medium text-white">
                        БҮХ АНГИЛАЛ
                      </div>
                      <SfButton
                        square
                        variant="tertiary"
                        aria-label="Close navigation menu"
                        onClick={close}
                        className="text-white"
                      >
                        <SfIconClose />
                      </SfButton>
                    </div>
                    {collections.map((collection) => (
                      <div key={collection.id}>
                        <h2
                          role="presentation"
                          className="typography-text-xs font-bold text-neutral-900 tracking-widest whitespace-nowrap px-4 py-2"
                        >
                          {collection.name}
                        </h2>
                        <hr className="mb-3.5" />
                        <ul key={`collection-${collection.id}`}>
                          {(collection.children || []).map((item) => (
                            <SfListItem size="sm" role="none" key={`collection-${collection.id}-${item.id}`}>
                              <Link
                                key={`category-children-${item.id}`}
                                className="focus-visible:outline focus-visible:rounded-sm"
                                to={`/t/${item.slug}`}
                              >
                                {item.name}
                              </Link>
                            </SfListItem>
                          ))}
                        </ul>
                      </div>
                    ))}
                    <div className="flex flex-col items-center justify-center bg-neutral-100 rounded-md border-neutral-300 overflow-hidden grow">
                      <img
                        src={'https://docs.storefrontui.io/v2-react/_next/static/media/watch.771966a5.png'}
                        alt={bannerDetails.title}
                        className="object-contain"
                      />
                      <p className="mb-4 mt-4 px-4 text-center typography-text-base font-medium">
                        {bannerDetails.title}
                      </p>
                    </div>
                    <SfButton
                      square
                      size="sm"
                      variant="tertiary"
                      aria-label="Close navigation menu"
                      onClick={close}
                      className="hidden md:block md:absolute md:right-0 hover:bg-white active:bg-white"
                    >
                      <SfIconClose className="text-neutral-500" />
                    </SfButton>
                  </SfDrawer>
                </CSSTransition>
              </li>
            </ul>

            <div className="flex flex-nowrap">
              <SfButton
                className="mr-2 -ml-0.5 text-white bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
                key={"shopping-cart"}
                aria-label={"Миний Сагс"}
                variant="tertiary"
                slotPrefix={<SfIconShoppingCart />}
                slotSuffix={cartQuantity || 0}
                onClick={onCartIconClick}
                square
              />
              {/* <SfButton
                className="mr-2 -ml-0.5 text-white bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
                key={"wishlist"}
                aria-label={"Хадгалсан"}
                variant="tertiary"
                slotPrefix={<SfIconFavorite />}
                square
              /> */}

              <Link to={isSignedIn ? "/account" : "/sign-in"}>
                <SfButton
                  className="mr-2 -ml-0.5 text-white bg-transparent hover:bg-primary-800 hover:text-white active:bg-primary-900 active:text-white"
                  key={"login"}
                  aria-label={"Нэвтрэх"}
                  variant="tertiary"
                  slotPrefix={<SfIconPerson />}
                  square
                />
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </div>
  );
}
