<?php

declare(strict_types=1);

// Runs Gobl's TypeScript generator (CSGeneratorTS) on a sample schema covering what gobl-utils-ts must
// handle: a single bigint primary key, a composite primary key, a relation and an enum. The output goes
// to the directory given as argument, where the integration suite imports it.
//
// Usage: php generate.php <output directory>

use Gobl\DBAL\Builders\TableBuilder;
use Gobl\DBAL\Db;
use Gobl\DBAL\DbConfig;
use Gobl\DBAL\Drivers\SQLite\SQLite;
use Gobl\ORM\Generators\CSGeneratorTS;
use GoblUtilsTs\Generator\Status;

require __DIR__ . '/vendor/autoload.php';

$out = $argv[1] ?? '';

if ('' === $out) {
	fwrite(STDERR, 'Usage: php generate.php <output directory>' . PHP_EOL);

	exit(1);
}

if (!is_dir($out)) {
	mkdir($out, 0o775, true);
}

// absolute: Gobl resolves a relative output directory against its file system root, not the working directory
$out = realpath($out);

$db = Db::newInstanceOf(SQLite::NAME, new DbConfig([
	'db_table_prefix' => '',
	'db_host'         => ':memory:',
	'db_port'         => '',
	'db_name'         => '',
	'db_user'         => '',
	'db_pass'         => '',
	'db_charset'      => 'utf8',
	'db_collate'      => 'utf8',
]));

$ns = $db->ns('Sample\Db');

$ns->table('users', static function (TableBuilder $t): void {
	$t->plural('users')->singular('user')->columnPrefix('user');
	$t->id();
	$t->string('name');
	$t->enum('status', Status::class);
});

$ns->table('roles', static function (TableBuilder $t): void {
	$t->plural('roles')->singular('role')->columnPrefix('role');
	$t->id();
	$t->string('title');
	$t->foreign('user_id', 'users', 'id');
	$t->belongsTo('user')->from('users');
});

$ns->table('memberships', static function (TableBuilder $t): void {
	$t->plural('memberships')->singular('membership')->columnPrefix('membership');
	$t->int('group');
	$t->int('member');
	$t->string('label')->nullable();
	$t->primary('group', 'member');
});

// as OZone does before generating: packs the namespaces and completes the tables
$db->lock();

(new CSGeneratorTS($db))->generate($db->getTables('Sample\Db'), $out);

fwrite(STDOUT, 'TypeScript entities generated in ' . $out . PHP_EOL);
