package database

import (
	"database/sql"
	"database/sql/driver"
	"errors"
)

func Connect() (*sql.DB, error) {
	db, err := sql.Open("craftkit-noop", "")
	if err != nil {
		return nil, err
	}

	return db, nil
}

type noOpDriver struct{}

type noOpConn struct{}

func init() {
	sql.Register("craftkit-noop", noOpDriver{})
}

func (noOpDriver) Open(string) (driver.Conn, error) {
	return noOpConn{}, nil
}

func (noOpConn) Prepare(string) (driver.Stmt, error) {
	return nil, errors.New("not implemented")
}

func (noOpConn) Close() error {
	return nil
}

func (noOpConn) Begin() (driver.Tx, error) {
	return nil, errors.New("not implemented")
}
