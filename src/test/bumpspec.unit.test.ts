import * as assert from 'assert';
import { bumpspecContent } from '../extension';

suite('Bumpspec Unit Test Suite', () => {
    const specContent = `
Name:           test
Version:        1.0
Release:        1%{?dist}
Summary:        Test package

%description
Test package

%prep
%setup -q

%build
%configure
make %{?_smp_mflags}

%install
rm -rf %{buildroot}
make install DESTDIR=%{buildroot}

%files
%defattr(-,root,root,-)
%doc

%changelog
* Wed May 29 2024 John Doe <john.doe@example.com> - 1.0-1
- Initial release
`;

    test('bumpspecContent should increment release', async () => {
        const newContent = await bumpspecContent(specContent);
        assert.ok(newContent.includes('Release:        2%{?dist}'), 'Release should be incremented to 2');
    });

    test('bumpspecContent with userstring should add changelog with user', async () => {
        const userstring = 'Test User <test@example.com>';
        const newContent = await bumpspecContent(specContent, userstring);
        assert.ok(newContent.includes('Test User <test@example.com>'), 'Changelog should contain the userstring');
    });
});
