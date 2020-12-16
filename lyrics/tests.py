from django.test import TestCase

from django.urls import reverse

from .factories import UserFactory, LyricFactory

class LyricIndexViewTests(TestCase):
    @classmethod
    def setUpTestData(cls):
        cls.normal_user = UserFactory(username='normal_user')
        cls.superuser = UserFactory(username='superuser', is_superuser=True)

    def test_redirect_if_not_authenticated(self):
        response = self.client.get(reverse('lyrics:index'))
        self.assertEqual(response.status_code, 302)

    def test_logged_in(self):
        self.client.force_login(self.normal_user)
        response = self.client.get(reverse('lyrics:index'))
        self.assertEqual(response.status_code, 200)

    def test_normal_user_no_lyrics(self):
        self.client.force_login(self.normal_user)
        response = self.client.get(reverse('lyrics:index'))
        self.assertQuerysetEqual(response.context['lyrics'], [])

    def test_normal_user_has_lyrics(self):
        self.client.force_login(self.normal_user)

        lyric_1 = LyricFactory(title='lyric 1', user=self.normal_user)
        lyric_2 = LyricFactory(title='lyric 2', user=self.normal_user)
        expected_result = ['<Lyric: lyric 1>', '<Lyric: lyric 2>']

        response = self.client.get(reverse('lyrics:index'))

        self.assertQuerysetEqual(response.context['lyrics'], expected_result, ordered=False)

    def test_normal_user_can_only_see_own_lyrics(self):
        self.client.force_login(self.normal_user)

        lyric_1 = LyricFactory(title='lyric 1', user=self.superuser)
        lyric_2 = LyricFactory(title='lyric 2', user=self.superuser)
        lyric_3 = LyricFactory(title='lyric 3', user=self.normal_user)
        lyric_4 = LyricFactory(title='lyric 4', user=self.normal_user)
        expected_result = ['<Lyric: lyric 3>', '<Lyric: lyric 4>']

        response = self.client.get(reverse('lyrics:index'))

        self.assertQuerysetEqual(response.context['lyrics'], expected_result, ordered=False)

    def test_superuser_no_lyrics(self):
        self.client.force_login(self.superuser)

        response = self.client.get(reverse('lyrics:index'))

        self.assertQuerysetEqual(response.context['lyrics'], [])

    def test_superuser_has_lyrics(self):
        self.client.force_login(self.superuser)

        lyric_1 = LyricFactory(title='lyric 1', user=self.superuser)
        lyric_2 = LyricFactory(title='lyric 2', user=self.superuser)
        expected_result = ['<Lyric: lyric 1>', '<Lyric: lyric 2>']

        response = self.client.get(reverse('lyrics:index'))

        self.assertQuerysetEqual(response.context['lyrics'], expected_result, ordered=False)

    def test_superuser_can_see_all_lyrics(self):
        self.client.force_login(self.superuser)

        lyric_1 = LyricFactory(title='lyric 1', user=self.superuser)
        lyric_2 = LyricFactory(title='lyric 2', user=self.superuser)
        lyric_3 = LyricFactory(title='lyric 3', user=self.normal_user)
        lyric_4 = LyricFactory(title='lyric 4', user=self.normal_user)
        expected_result = ['<Lyric: lyric 1>', '<Lyric: lyric 2>', '<Lyric: lyric 3>', '<Lyric: lyric 4>']

        response = self.client.get(reverse('lyrics:index'))

        self.assertQuerysetEqual(response.context['lyrics'], expected_result, ordered=False)
