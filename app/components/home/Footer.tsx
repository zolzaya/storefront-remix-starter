import { Link } from '@remix-run/react';
import {
  SfButton,
  SfIconFacebook,
  SfIconInstagram,
  SfIconTwitter,
  SfLink,
  SfListItem,
} from '@storefront-ui/react';
import { RootLoaderData } from '~/root';

const socialMedia = [
  {
    label: 'Facebook',
    link: '/facebook',
    icon: () => <SfIconFacebook />,
  },
  {
    label: 'Twitter',
    link: '/twitter',
    icon: () => <SfIconTwitter />,
  },
  {
    label: 'Instagram',
    link: '/instagram',
    icon: () => <SfIconInstagram />,
  },
];

const bottomLinks = [
  {
    label: 'Үйлчилгээний нөхцөл',
    link: '/tos',
  },
];

export default function Footer({collections}: { collections: RootLoaderData['collections'] }) {

  return (
    <>
      <footer className="pt-10 bg-neutral-100 border-t-2">
        <div className="grid justify-center grid-cols-[1fr_1fr] md:grid-cols-[repeat(4,1fr)] px-4 md:px-6 pb-10 max-w-[1536px] mx-auto">
          {collections.map((collection) => (
            <div className="grid grid-cols xs:pb-4" key={collection.id}>
              <div className="ml-4 text-lg font-medium leading-7 text-neutral-900 font-body">
                {collection.name}
              </div>
              {(collection.children || []).map((children) => (
                <SfListItem
                  className="py-2 !bg-transparent typography-text-sm font-body"
                  key={`${collection.id}-${children.id}`}
                >
                  <SfLink
                    className="no-underline text-neutral-600 hover:underline hover:!text-neutral-900 active:underline active:!text-neutral-900"
                    variant="secondary"
                    href={'/t/' + children.slug}
                  >
                    {children.name}
                  </SfLink>
                </SfListItem>
              ))}
            </div>
          ))}
        </div>
        <div className="bg-neutral-900 justify-end px-4 py-10 md:flex md:py-6 max-w-[1536px] mx-auto">
          <div className="flex justify-center py-2 gap-x-4 md:self-start">
            {socialMedia.map(({ icon: Icon, label, link }) => (
              <SfButton
                key={label}
                square
                as="a"
                variant="tertiary"
                className="text-white active:text-white hover:text-white hover:!bg-neutral-500 active:bg-transparent"
                href={link}
                aria-label={`Go to ${label} page`}
              >
                <Icon />
              </SfButton>
            ))}
          </div>
          <div className="flex items-center justify-center gap-6 py-2 my-4 md:ml-auto md:my-0">
            {bottomLinks.map(({ label, link }) => (
              <SfLink
                key={label}
                variant="secondary"
                className="text-white/50 no-underline typography-text-sm active:text-white active:underline hover:text-white hover:underline"
                href={link}
              >
                {label}
              </SfLink>
            ))}
          </div>
          <p className="flex items-center justify-center py-2 leading-5 text-center typography-text-sm text-white/50 font-body md:ml-6">
            @ 2023 superb.mn
          </p>
        </div>
      </footer>
    </>
  );
}
