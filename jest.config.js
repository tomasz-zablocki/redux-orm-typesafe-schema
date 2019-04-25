module.exports = {
  verbose: true,
  testEnvironment: 'node',
  moduleFileExtensions: [
    'js',
    'ts',
    'json'
  ],
  rootDir: '.',
  testMatch: [
    '<rootDir>/src/**/*.+spec.ts',
    '<rootDir>/src/**/*.+typespec.ts'
  ],
  transform: {
    '.typespec.ts': 'dts-jest/transform',
    '.spec.ts': 'ts-jest'
  },
  moduleNameMapper: {
    '@spec/(.*)': '<rootDir>/src/spec/$1'
  },
  preset: 'ts-jest',
  globals: {
    window: {},
    _dts_jest_: {
      compiler_options: './tsconfig.json',
      enclosing_declaration: true,
      test_value: true,
      test_type: true,
      transpile: true
    }
  },
  reporters: [
    'default',
    'dts-jest/reporter'
  ]
}