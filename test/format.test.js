const expect = require('chai').expect;
const sinon = require('sinon');

const { formatDate, formatDuration, formatText, formatPhone } = require('../utils/format');

// Mocks a date in order to test formatDate function
sinon.useFakeTimers(new Date(2020, 11, 11, 11));

describe('Formatting', () => {
    describe('Text', () => {
        it('Should convert email addresses to links', () => {
            const text = 'abcd test@gmail.com efgh';

            expect(formatText(text)).to.equal(
                'abcd <a href="mailto:test@gmail.com">test@gmail.com</a> efgh'
            );
        });

        it('Should not convert incomplete emails', () => {
            const text1 = 'abcd test@gmail efgh';
            const text2 = 'abcd test@gmail.';

            expect(formatText(text1)).to.equal('abcd test@gmail efgh');
            expect(formatText(text2)).to.equal('abcd test@gmail.');
        });
    });

    describe('Phone', () => {
        it('Should format phone numbers with hyphens', () => {
            const num1 = 15555555555;
            const num2 = 5555555555;

            expect(formatPhone(num1)).to.equal('1-555-555-5555');
            expect(formatPhone(num2)).to.equal('555-555-5555');
        });

        it('Should not hyphenate shorter numbers', () => {
            const num = 555555;

            expect(formatPhone(num)).to.be.oneOf([555555, '555555']);
        });
    });

    describe('Duration', () => {
        it('Should display shorter times in minutes/seconds', () => {
            const duration1 = 10000;
            const duration2 = 600000;

            expect(formatDuration(duration1)).to.equal('00:10');
            expect(formatDuration(duration2)).to.equal('10:00');
        });

        it('Should include hours in longer times', () => {
            const duration1 = 3600000;
            const duration2 = 7201000;

            expect(formatDuration(duration1)).to.equal('01:00:00');
            expect(formatDuration(duration2)).to.equal('02:00:01');
        });
    });

    describe('Time', () => {
        it('Should display a same-day message in hours', () => {
            const date1 = new Date(2020, 11, 11, 10).getTime();
            const date2 = new Date(2020, 11, 11, 9).getTime();

            expect(formatDate(date1)).to.equal('1 hour ago');
            expect(formatDate(date2)).to.equal('2 hours ago');
        });

        it('Should display a same-week message in days', () => {
            const date1 = new Date(2020, 11, 10, 10).getTime();
            const date2 = new Date(2020, 11, 9, 9).getTime();

            expect(formatDate(date1)).to.equal('1 day ago');
            expect(formatDate(date2)).to.equal('2 days ago');
        });

        it('Should display full date if older than 1 week', () => {
            const date1 = new Date(2020, 11, 1, 10).getTime();
            const date2 = new Date(2019, 0, 10, 9).getTime();

            expect(formatDate(date1)).to.equal('December 1, 2020');
            expect(formatDate(date2)).to.equal('January 10, 2019');
        });
    });
});